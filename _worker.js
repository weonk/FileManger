var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/bcryptjs/dist/bcrypt.js
var require_bcrypt = __commonJS({
  "node_modules/bcryptjs/dist/bcrypt.js"(exports, module) {
    (function(global, factory) {
      if (typeof define === "function" && define["amd"])
        define([], factory);
      else if (typeof __require === "function" && typeof module === "object" && module && module["exports"])
        module["exports"] = factory();
      else
        (global["dcodeIO"] = global["dcodeIO"] || {})["bcrypt"] = factory();
    })(exports, function() {
      "use strict";
      var bcrypt2 = {};
      var randomFallback = null;
      function random(len) {
        if (typeof module !== "undefined" && module && module["exports"])
          try {
            return __require("crypto")["randomBytes"](len);
          } catch (e) {
          }
        try {
          var a;
          (self["crypto"] || self["msCrypto"])["getRandomValues"](a = new Uint32Array(len));
          return Array.prototype.slice.call(a);
        } catch (e) {
        }
        if (!randomFallback)
          throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
        return randomFallback(len);
      }
      var randomAvailable = false;
      try {
        random(1);
        randomAvailable = true;
      } catch (e) {
      }
      randomFallback = null;
      bcrypt2.setRandomFallback = function(random2) {
        randomFallback = random2;
      };
      bcrypt2.genSaltSync = function(rounds, seed_length) {
        rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof rounds !== "number")
          throw Error("Illegal arguments: " + typeof rounds + ", " + typeof seed_length);
        if (rounds < 4)
          rounds = 4;
        else if (rounds > 31)
          rounds = 31;
        var salt = [];
        salt.push("$2a$");
        if (rounds < 10)
          salt.push("0");
        salt.push(rounds.toString());
        salt.push("$");
        salt.push(base64_encode(random(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
        return salt.join("");
      };
      bcrypt2.genSalt = function(rounds, seed_length, callback) {
        if (typeof seed_length === "function")
          callback = seed_length, seed_length = void 0;
        if (typeof rounds === "function")
          callback = rounds, rounds = void 0;
        if (typeof rounds === "undefined")
          rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
        else if (typeof rounds !== "number")
          throw Error("illegal arguments: " + typeof rounds);
        function _async(callback2) {
          nextTick(function() {
            try {
              callback2(null, bcrypt2.genSaltSync(rounds));
            } catch (err) {
              callback2(err);
            }
          });
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt2.hashSync = function(s, salt) {
        if (typeof salt === "undefined")
          salt = GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof salt === "number")
          salt = bcrypt2.genSaltSync(salt);
        if (typeof s !== "string" || typeof salt !== "string")
          throw Error("Illegal arguments: " + typeof s + ", " + typeof salt);
        return _hash(s, salt);
      };
      bcrypt2.hash = function(s, salt, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s === "string" && typeof salt === "number")
            bcrypt2.genSalt(salt, function(err, salt2) {
              _hash(s, salt2, callback2, progressCallback);
            });
          else if (typeof s === "string" && typeof salt === "string")
            _hash(s, salt, callback2, progressCallback);
          else
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s + ", " + typeof salt)));
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      function safeStringCompare(known, unknown) {
        var right = 0, wrong = 0;
        for (var i = 0, k = known.length; i < k; ++i) {
          if (known.charCodeAt(i) === unknown.charCodeAt(i))
            ++right;
          else
            ++wrong;
        }
        if (right < 0)
          return false;
        return wrong === 0;
      }
      bcrypt2.compareSync = function(s, hash2) {
        if (typeof s !== "string" || typeof hash2 !== "string")
          throw Error("Illegal arguments: " + typeof s + ", " + typeof hash2);
        if (hash2.length !== 60)
          return false;
        return safeStringCompare(bcrypt2.hashSync(s, hash2.substr(0, hash2.length - 31)), hash2);
      };
      bcrypt2.compare = function(s, hash2, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s !== "string" || typeof hash2 !== "string") {
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s + ", " + typeof hash2)));
            return;
          }
          if (hash2.length !== 60) {
            nextTick(callback2.bind(this, null, false));
            return;
          }
          bcrypt2.hash(s, hash2.substr(0, 29), function(err, comp) {
            if (err)
              callback2(err);
            else
              callback2(null, safeStringCompare(comp, hash2));
          }, progressCallback);
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt2.getRounds = function(hash2) {
        if (typeof hash2 !== "string")
          throw Error("Illegal arguments: " + typeof hash2);
        return parseInt(hash2.split("$")[2], 10);
      };
      bcrypt2.getSalt = function(hash2) {
        if (typeof hash2 !== "string")
          throw Error("Illegal arguments: " + typeof hash2);
        if (hash2.length !== 60)
          throw Error("Illegal hash length: " + hash2.length + " != 60");
        return hash2.substring(0, 29);
      };
      var nextTick = typeof process !== "undefined" && process && typeof process.nextTick === "function" ? typeof setImmediate === "function" ? setImmediate : process.nextTick : setTimeout;
      function stringToBytes(str) {
        var out = [], i = 0;
        utfx.encodeUTF16toUTF8(function() {
          if (i >= str.length)
            return null;
          return str.charCodeAt(i++);
        }, function(b) {
          out.push(b);
        });
        return out;
      }
      var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
      var BASE64_INDEX = [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        1,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        -1,
        -1,
        -1,
        -1,
        -1
      ];
      var stringFromCharCode = String.fromCharCode;
      function base64_encode(b, len) {
        var off = 0, rs = [], c1, c2;
        if (len <= 0 || len > b.length)
          throw Error("Illegal len: " + len);
        while (off < len) {
          c1 = b[off++] & 255;
          rs.push(BASE64_CODE[c1 >> 2 & 63]);
          c1 = (c1 & 3) << 4;
          if (off >= len) {
            rs.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b[off++] & 255;
          c1 |= c2 >> 4 & 15;
          rs.push(BASE64_CODE[c1 & 63]);
          c1 = (c2 & 15) << 2;
          if (off >= len) {
            rs.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b[off++] & 255;
          c1 |= c2 >> 6 & 3;
          rs.push(BASE64_CODE[c1 & 63]);
          rs.push(BASE64_CODE[c2 & 63]);
        }
        return rs.join("");
      }
      function base64_decode(s, len) {
        var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
        if (len <= 0)
          throw Error("Illegal len: " + len);
        while (off < slen - 1 && olen < len) {
          code = s.charCodeAt(off++);
          c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          code = s.charCodeAt(off++);
          c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c1 == -1 || c2 == -1)
            break;
          o = c1 << 2 >>> 0;
          o |= (c2 & 48) >> 4;
          rs.push(stringFromCharCode(o));
          if (++olen >= len || off >= slen)
            break;
          code = s.charCodeAt(off++);
          c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c3 == -1)
            break;
          o = (c2 & 15) << 4 >>> 0;
          o |= (c3 & 60) >> 2;
          rs.push(stringFromCharCode(o));
          if (++olen >= len || off >= slen)
            break;
          code = s.charCodeAt(off++);
          c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          o = (c3 & 3) << 6 >>> 0;
          o |= c4;
          rs.push(stringFromCharCode(o));
          ++olen;
        }
        var res = [];
        for (off = 0; off < olen; off++)
          res.push(rs[off].charCodeAt(0));
        return res;
      }
      var utfx = function() {
        "use strict";
        var utfx2 = {};
        utfx2.MAX_CODEPOINT = 1114111;
        utfx2.encodeUTF8 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp < 128)
              dst(cp & 127);
            else if (cp < 2048)
              dst(cp >> 6 & 31 | 192), dst(cp & 63 | 128);
            else if (cp < 65536)
              dst(cp >> 12 & 15 | 224), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            else
              dst(cp >> 18 & 7 | 240), dst(cp >> 12 & 63 | 128), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            cp = null;
          }
        };
        utfx2.decodeUTF8 = function(src, dst) {
          var a, b, c, d, fail = function(b2) {
            b2 = b2.slice(0, b2.indexOf(null));
            var err = Error(b2.toString());
            err.name = "TruncatedError";
            err["bytes"] = b2;
            throw err;
          };
          while ((a = src()) !== null) {
            if ((a & 128) === 0)
              dst(a);
            else if ((a & 224) === 192)
              (b = src()) === null && fail([a, b]), dst((a & 31) << 6 | b & 63);
            else if ((a & 240) === 224)
              ((b = src()) === null || (c = src()) === null) && fail([a, b, c]), dst((a & 15) << 12 | (b & 63) << 6 | c & 63);
            else if ((a & 248) === 240)
              ((b = src()) === null || (c = src()) === null || (d = src()) === null) && fail([a, b, c, d]), dst((a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63);
            else
              throw RangeError("Illegal starting byte: " + a);
          }
        };
        utfx2.UTF16toUTF8 = function(src, dst) {
          var c1, c2 = null;
          while (true) {
            if ((c1 = c2 !== null ? c2 : src()) === null)
              break;
            if (c1 >= 55296 && c1 <= 57343) {
              if ((c2 = src()) !== null) {
                if (c2 >= 56320 && c2 <= 57343) {
                  dst((c1 - 55296) * 1024 + c2 - 56320 + 65536);
                  c2 = null;
                  continue;
                }
              }
            }
            dst(c1);
          }
          if (c2 !== null)
            dst(c2);
        };
        utfx2.UTF8toUTF16 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp <= 65535)
              dst(cp);
            else
              cp -= 65536, dst((cp >> 10) + 55296), dst(cp % 1024 + 56320);
            cp = null;
          }
        };
        utfx2.encodeUTF16toUTF8 = function(src, dst) {
          utfx2.UTF16toUTF8(src, function(cp) {
            utfx2.encodeUTF8(cp, dst);
          });
        };
        utfx2.decodeUTF8toUTF16 = function(src, dst) {
          utfx2.decodeUTF8(src, function(cp) {
            utfx2.UTF8toUTF16(cp, dst);
          });
        };
        utfx2.calculateCodePoint = function(cp) {
          return cp < 128 ? 1 : cp < 2048 ? 2 : cp < 65536 ? 3 : 4;
        };
        utfx2.calculateUTF8 = function(src) {
          var cp, l = 0;
          while ((cp = src()) !== null)
            l += utfx2.calculateCodePoint(cp);
          return l;
        };
        utfx2.calculateUTF16asUTF8 = function(src) {
          var n = 0, l = 0;
          utfx2.UTF16toUTF8(src, function(cp) {
            ++n;
            l += utfx2.calculateCodePoint(cp);
          });
          return [n, l];
        };
        return utfx2;
      }();
      Date.now = Date.now || function() {
        return +/* @__PURE__ */ new Date();
      };
      var BCRYPT_SALT_LEN = 16;
      var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
      var BLOWFISH_NUM_ROUNDS = 16;
      var MAX_EXECUTION_TIME = 100;
      var P_ORIG = [
        608135816,
        2242054355,
        320440878,
        57701188,
        2752067618,
        698298832,
        137296536,
        3964562569,
        1160258022,
        953160567,
        3193202383,
        887688300,
        3232508343,
        3380367581,
        1065670069,
        3041331479,
        2450970073,
        2306472731
      ];
      var S_ORIG = [
        3509652390,
        2564797868,
        805139163,
        3491422135,
        3101798381,
        1780907670,
        3128725573,
        4046225305,
        614570311,
        3012652279,
        134345442,
        2240740374,
        1667834072,
        1901547113,
        2757295779,
        4103290238,
        227898511,
        1921955416,
        1904987480,
        2182433518,
        2069144605,
        3260701109,
        2620446009,
        720527379,
        3318853667,
        677414384,
        3393288472,
        3101374703,
        2390351024,
        1614419982,
        1822297739,
        2954791486,
        3608508353,
        3174124327,
        2024746970,
        1432378464,
        3864339955,
        2857741204,
        1464375394,
        1676153920,
        1439316330,
        715854006,
        3033291828,
        289532110,
        2706671279,
        2087905683,
        3018724369,
        1668267050,
        732546397,
        1947742710,
        3462151702,
        2609353502,
        2950085171,
        1814351708,
        2050118529,
        680887927,
        999245976,
        1800124847,
        3300911131,
        1713906067,
        1641548236,
        4213287313,
        1216130144,
        1575780402,
        4018429277,
        3917837745,
        3693486850,
        3949271944,
        596196993,
        3549867205,
        258830323,
        2213823033,
        772490370,
        2760122372,
        1774776394,
        2652871518,
        566650946,
        4142492826,
        1728879713,
        2882767088,
        1783734482,
        3629395816,
        2517608232,
        2874225571,
        1861159788,
        326777828,
        3124490320,
        2130389656,
        2716951837,
        967770486,
        1724537150,
        2185432712,
        2364442137,
        1164943284,
        2105845187,
        998989502,
        3765401048,
        2244026483,
        1075463327,
        1455516326,
        1322494562,
        910128902,
        469688178,
        1117454909,
        936433444,
        3490320968,
        3675253459,
        1240580251,
        122909385,
        2157517691,
        634681816,
        4142456567,
        3825094682,
        3061402683,
        2540495037,
        79693498,
        3249098678,
        1084186820,
        1583128258,
        426386531,
        1761308591,
        1047286709,
        322548459,
        995290223,
        1845252383,
        2603652396,
        3431023940,
        2942221577,
        3202600964,
        3727903485,
        1712269319,
        422464435,
        3234572375,
        1170764815,
        3523960633,
        3117677531,
        1434042557,
        442511882,
        3600875718,
        1076654713,
        1738483198,
        4213154764,
        2393238008,
        3677496056,
        1014306527,
        4251020053,
        793779912,
        2902807211,
        842905082,
        4246964064,
        1395751752,
        1040244610,
        2656851899,
        3396308128,
        445077038,
        3742853595,
        3577915638,
        679411651,
        2892444358,
        2354009459,
        1767581616,
        3150600392,
        3791627101,
        3102740896,
        284835224,
        4246832056,
        1258075500,
        768725851,
        2589189241,
        3069724005,
        3532540348,
        1274779536,
        3789419226,
        2764799539,
        1660621633,
        3471099624,
        4011903706,
        913787905,
        3497959166,
        737222580,
        2514213453,
        2928710040,
        3937242737,
        1804850592,
        3499020752,
        2949064160,
        2386320175,
        2390070455,
        2415321851,
        4061277028,
        2290661394,
        2416832540,
        1336762016,
        1754252060,
        3520065937,
        3014181293,
        791618072,
        3188594551,
        3933548030,
        2332172193,
        3852520463,
        3043980520,
        413987798,
        3465142937,
        3030929376,
        4245938359,
        2093235073,
        3534596313,
        375366246,
        2157278981,
        2479649556,
        555357303,
        3870105701,
        2008414854,
        3344188149,
        4221384143,
        3956125452,
        2067696032,
        3594591187,
        2921233993,
        2428461,
        544322398,
        577241275,
        1471733935,
        610547355,
        4027169054,
        1432588573,
        1507829418,
        2025931657,
        3646575487,
        545086370,
        48609733,
        2200306550,
        1653985193,
        298326376,
        1316178497,
        3007786442,
        2064951626,
        458293330,
        2589141269,
        3591329599,
        3164325604,
        727753846,
        2179363840,
        146436021,
        1461446943,
        4069977195,
        705550613,
        3059967265,
        3887724982,
        4281599278,
        3313849956,
        1404054877,
        2845806497,
        146425753,
        1854211946,
        1266315497,
        3048417604,
        3681880366,
        3289982499,
        290971e4,
        1235738493,
        2632868024,
        2414719590,
        3970600049,
        1771706367,
        1449415276,
        3266420449,
        422970021,
        1963543593,
        2690192192,
        3826793022,
        1062508698,
        1531092325,
        1804592342,
        2583117782,
        2714934279,
        4024971509,
        1294809318,
        4028980673,
        1289560198,
        2221992742,
        1669523910,
        35572830,
        157838143,
        1052438473,
        1016535060,
        1802137761,
        1753167236,
        1386275462,
        3080475397,
        2857371447,
        1040679964,
        2145300060,
        2390574316,
        1461121720,
        2956646967,
        4031777805,
        4028374788,
        33600511,
        2920084762,
        1018524850,
        629373528,
        3691585981,
        3515945977,
        2091462646,
        2486323059,
        586499841,
        988145025,
        935516892,
        3367335476,
        2599673255,
        2839830854,
        265290510,
        3972581182,
        2759138881,
        3795373465,
        1005194799,
        847297441,
        406762289,
        1314163512,
        1332590856,
        1866599683,
        4127851711,
        750260880,
        613907577,
        1450815602,
        3165620655,
        3734664991,
        3650291728,
        3012275730,
        3704569646,
        1427272223,
        778793252,
        1343938022,
        2676280711,
        2052605720,
        1946737175,
        3164576444,
        3914038668,
        3967478842,
        3682934266,
        1661551462,
        3294938066,
        4011595847,
        840292616,
        3712170807,
        616741398,
        312560963,
        711312465,
        1351876610,
        322626781,
        1910503582,
        271666773,
        2175563734,
        1594956187,
        70604529,
        3617834859,
        1007753275,
        1495573769,
        4069517037,
        2549218298,
        2663038764,
        504708206,
        2263041392,
        3941167025,
        2249088522,
        1514023603,
        1998579484,
        1312622330,
        694541497,
        2582060303,
        2151582166,
        1382467621,
        776784248,
        2618340202,
        3323268794,
        2497899128,
        2784771155,
        503983604,
        4076293799,
        907881277,
        423175695,
        432175456,
        1378068232,
        4145222326,
        3954048622,
        3938656102,
        3820766613,
        2793130115,
        2977904593,
        26017576,
        3274890735,
        3194772133,
        1700274565,
        1756076034,
        4006520079,
        3677328699,
        720338349,
        1533947780,
        354530856,
        688349552,
        3973924725,
        1637815568,
        332179504,
        3949051286,
        53804574,
        2852348879,
        3044236432,
        1282449977,
        3583942155,
        3416972820,
        4006381244,
        1617046695,
        2628476075,
        3002303598,
        1686838959,
        431878346,
        2686675385,
        1700445008,
        1080580658,
        1009431731,
        832498133,
        3223435511,
        2605976345,
        2271191193,
        2516031870,
        1648197032,
        4164389018,
        2548247927,
        300782431,
        375919233,
        238389289,
        3353747414,
        2531188641,
        2019080857,
        1475708069,
        455242339,
        2609103871,
        448939670,
        3451063019,
        1395535956,
        2413381860,
        1841049896,
        1491858159,
        885456874,
        4264095073,
        4001119347,
        1565136089,
        3898914787,
        1108368660,
        540939232,
        1173283510,
        2745871338,
        3681308437,
        4207628240,
        3343053890,
        4016749493,
        1699691293,
        1103962373,
        3625875870,
        2256883143,
        3830138730,
        1031889488,
        3479347698,
        1535977030,
        4236805024,
        3251091107,
        2132092099,
        1774941330,
        1199868427,
        1452454533,
        157007616,
        2904115357,
        342012276,
        595725824,
        1480756522,
        206960106,
        497939518,
        591360097,
        863170706,
        2375253569,
        3596610801,
        1814182875,
        2094937945,
        3421402208,
        1082520231,
        3463918190,
        2785509508,
        435703966,
        3908032597,
        1641649973,
        2842273706,
        3305899714,
        1510255612,
        2148256476,
        2655287854,
        3276092548,
        4258621189,
        236887753,
        3681803219,
        274041037,
        1734335097,
        3815195456,
        3317970021,
        1899903192,
        1026095262,
        4050517792,
        356393447,
        2410691914,
        3873677099,
        3682840055,
        3913112168,
        2491498743,
        4132185628,
        2489919796,
        1091903735,
        1979897079,
        3170134830,
        3567386728,
        3557303409,
        857797738,
        1136121015,
        1342202287,
        507115054,
        2535736646,
        337727348,
        3213592640,
        1301675037,
        2528481711,
        1895095763,
        1721773893,
        3216771564,
        62756741,
        2142006736,
        835421444,
        2531993523,
        1442658625,
        3659876326,
        2882144922,
        676362277,
        1392781812,
        170690266,
        3921047035,
        1759253602,
        3611846912,
        1745797284,
        664899054,
        1329594018,
        3901205900,
        3045908486,
        2062866102,
        2865634940,
        3543621612,
        3464012697,
        1080764994,
        553557557,
        3656615353,
        3996768171,
        991055499,
        499776247,
        1265440854,
        648242737,
        3940784050,
        980351604,
        3713745714,
        1749149687,
        3396870395,
        4211799374,
        3640570775,
        1161844396,
        3125318951,
        1431517754,
        545492359,
        4268468663,
        3499529547,
        1437099964,
        2702547544,
        3433638243,
        2581715763,
        2787789398,
        1060185593,
        1593081372,
        2418618748,
        4260947970,
        69676912,
        2159744348,
        86519011,
        2512459080,
        3838209314,
        1220612927,
        3339683548,
        133810670,
        1090789135,
        1078426020,
        1569222167,
        845107691,
        3583754449,
        4072456591,
        1091646820,
        628848692,
        1613405280,
        3757631651,
        526609435,
        236106946,
        48312990,
        2942717905,
        3402727701,
        1797494240,
        859738849,
        992217954,
        4005476642,
        2243076622,
        3870952857,
        3732016268,
        765654824,
        3490871365,
        2511836413,
        1685915746,
        3888969200,
        1414112111,
        2273134842,
        3281911079,
        4080962846,
        172450625,
        2569994100,
        980381355,
        4109958455,
        2819808352,
        2716589560,
        2568741196,
        3681446669,
        3329971472,
        1835478071,
        660984891,
        3704678404,
        4045999559,
        3422617507,
        3040415634,
        1762651403,
        1719377915,
        3470491036,
        2693910283,
        3642056355,
        3138596744,
        1364962596,
        2073328063,
        1983633131,
        926494387,
        3423689081,
        2150032023,
        4096667949,
        1749200295,
        3328846651,
        309677260,
        2016342300,
        1779581495,
        3079819751,
        111262694,
        1274766160,
        443224088,
        298511866,
        1025883608,
        3806446537,
        1145181785,
        168956806,
        3641502830,
        3584813610,
        1689216846,
        3666258015,
        3200248200,
        1692713982,
        2646376535,
        4042768518,
        1618508792,
        1610833997,
        3523052358,
        4130873264,
        2001055236,
        3610705100,
        2202168115,
        4028541809,
        2961195399,
        1006657119,
        2006996926,
        3186142756,
        1430667929,
        3210227297,
        1314452623,
        4074634658,
        4101304120,
        2273951170,
        1399257539,
        3367210612,
        3027628629,
        1190975929,
        2062231137,
        2333990788,
        2221543033,
        2438960610,
        1181637006,
        548689776,
        2362791313,
        3372408396,
        3104550113,
        3145860560,
        296247880,
        1970579870,
        3078560182,
        3769228297,
        1714227617,
        3291629107,
        3898220290,
        166772364,
        1251581989,
        493813264,
        448347421,
        195405023,
        2709975567,
        677966185,
        3703036547,
        1463355134,
        2715995803,
        1338867538,
        1343315457,
        2802222074,
        2684532164,
        233230375,
        2599980071,
        2000651841,
        3277868038,
        1638401717,
        4028070440,
        3237316320,
        6314154,
        819756386,
        300326615,
        590932579,
        1405279636,
        3267499572,
        3150704214,
        2428286686,
        3959192993,
        3461946742,
        1862657033,
        1266418056,
        963775037,
        2089974820,
        2263052895,
        1917689273,
        448879540,
        3550394620,
        3981727096,
        150775221,
        3627908307,
        1303187396,
        508620638,
        2975983352,
        2726630617,
        1817252668,
        1876281319,
        1457606340,
        908771278,
        3720792119,
        3617206836,
        2455994898,
        1729034894,
        1080033504,
        976866871,
        3556439503,
        2881648439,
        1522871579,
        1555064734,
        1336096578,
        3548522304,
        2579274686,
        3574697629,
        3205460757,
        3593280638,
        3338716283,
        3079412587,
        564236357,
        2993598910,
        1781952180,
        1464380207,
        3163844217,
        3332601554,
        1699332808,
        1393555694,
        1183702653,
        3581086237,
        1288719814,
        691649499,
        2847557200,
        2895455976,
        3193889540,
        2717570544,
        1781354906,
        1676643554,
        2592534050,
        3230253752,
        1126444790,
        2770207658,
        2633158820,
        2210423226,
        2615765581,
        2414155088,
        3127139286,
        673620729,
        2805611233,
        1269405062,
        4015350505,
        3341807571,
        4149409754,
        1057255273,
        2012875353,
        2162469141,
        2276492801,
        2601117357,
        993977747,
        3918593370,
        2654263191,
        753973209,
        36408145,
        2530585658,
        25011837,
        3520020182,
        2088578344,
        530523599,
        2918365339,
        1524020338,
        1518925132,
        3760827505,
        3759777254,
        1202760957,
        3985898139,
        3906192525,
        674977740,
        4174734889,
        2031300136,
        2019492241,
        3983892565,
        4153806404,
        3822280332,
        352677332,
        2297720250,
        60907813,
        90501309,
        3286998549,
        1016092578,
        2535922412,
        2839152426,
        457141659,
        509813237,
        4120667899,
        652014361,
        1966332200,
        2975202805,
        55981186,
        2327461051,
        676427537,
        3255491064,
        2882294119,
        3433927263,
        1307055953,
        942726286,
        933058658,
        2468411793,
        3933900994,
        4215176142,
        1361170020,
        2001714738,
        2830558078,
        3274259782,
        1222529897,
        1679025792,
        2729314320,
        3714953764,
        1770335741,
        151462246,
        3013232138,
        1682292957,
        1483529935,
        471910574,
        1539241949,
        458788160,
        3436315007,
        1807016891,
        3718408830,
        978976581,
        1043663428,
        3165965781,
        1927990952,
        4200891579,
        2372276910,
        3208408903,
        3533431907,
        1412390302,
        2931980059,
        4132332400,
        1947078029,
        3881505623,
        4168226417,
        2941484381,
        1077988104,
        1320477388,
        886195818,
        18198404,
        3786409e3,
        2509781533,
        112762804,
        3463356488,
        1866414978,
        891333506,
        18488651,
        661792760,
        1628790961,
        3885187036,
        3141171499,
        876946877,
        2693282273,
        1372485963,
        791857591,
        2686433993,
        3759982718,
        3167212022,
        3472953795,
        2716379847,
        445679433,
        3561995674,
        3504004811,
        3574258232,
        54117162,
        3331405415,
        2381918588,
        3769707343,
        4154350007,
        1140177722,
        4074052095,
        668550556,
        3214352940,
        367459370,
        261225585,
        2610173221,
        4209349473,
        3468074219,
        3265815641,
        314222801,
        3066103646,
        3808782860,
        282218597,
        3406013506,
        3773591054,
        379116347,
        1285071038,
        846784868,
        2669647154,
        3771962079,
        3550491691,
        2305946142,
        453669953,
        1268987020,
        3317592352,
        3279303384,
        3744833421,
        2610507566,
        3859509063,
        266596637,
        3847019092,
        517658769,
        3462560207,
        3443424879,
        370717030,
        4247526661,
        2224018117,
        4143653529,
        4112773975,
        2788324899,
        2477274417,
        1456262402,
        2901442914,
        1517677493,
        1846949527,
        2295493580,
        3734397586,
        2176403920,
        1280348187,
        1908823572,
        3871786941,
        846861322,
        1172426758,
        3287448474,
        3383383037,
        1655181056,
        3139813346,
        901632758,
        1897031941,
        2986607138,
        3066810236,
        3447102507,
        1393639104,
        373351379,
        950779232,
        625454576,
        3124240540,
        4148612726,
        2007998917,
        544563296,
        2244738638,
        2330496472,
        2058025392,
        1291430526,
        424198748,
        50039436,
        29584100,
        3605783033,
        2429876329,
        2791104160,
        1057563949,
        3255363231,
        3075367218,
        3463963227,
        1469046755,
        985887462
      ];
      var C_ORIG = [
        1332899944,
        1700884034,
        1701343084,
        1684370003,
        1668446532,
        1869963892
      ];
      function _encipher(lr, off, P, S) {
        var n, l = lr[off], r = lr[off + 1];
        l ^= P[0];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[1];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[2];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[3];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[4];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[5];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[6];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[7];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[8];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[9];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[10];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[11];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[12];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[13];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[14];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[15];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[16];
        lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
        lr[off + 1] = l;
        return lr;
      }
      function _streamtoword(data, offp) {
        for (var i = 0, word = 0; i < 4; ++i)
          word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
        return { key: word, offp };
      }
      function _key(key, P, S) {
        var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
        for (i = 0; i < plen; i += 2)
          lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
        for (i = 0; i < slen; i += 2)
          lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
      }
      function _ekskey(data, key, P, S) {
        var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
        offp = 0;
        for (i = 0; i < plen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
        for (i = 0; i < slen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
      }
      function _crypt(b, salt, rounds, callback, progressCallback) {
        var cdata = C_ORIG.slice(), clen = cdata.length, err;
        if (rounds < 4 || rounds > 31) {
          err = Error("Illegal number of rounds (4-31): " + rounds);
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        if (salt.length !== BCRYPT_SALT_LEN) {
          err = Error("Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN);
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        rounds = 1 << rounds >>> 0;
        var P, S, i = 0, j;
        if (Int32Array) {
          P = new Int32Array(P_ORIG);
          S = new Int32Array(S_ORIG);
        } else {
          P = P_ORIG.slice();
          S = S_ORIG.slice();
        }
        _ekskey(salt, b, P, S);
        function next() {
          if (progressCallback)
            progressCallback(i / rounds);
          if (i < rounds) {
            var start = Date.now();
            for (; i < rounds; ) {
              i = i + 1;
              _key(b, P, S);
              _key(salt, P, S);
              if (Date.now() - start > MAX_EXECUTION_TIME)
                break;
            }
          } else {
            for (i = 0; i < 64; i++)
              for (j = 0; j < clen >> 1; j++)
                _encipher(cdata, j << 1, P, S);
            var ret = [];
            for (i = 0; i < clen; i++)
              ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
            if (callback) {
              callback(null, ret);
              return;
            } else
              return ret;
          }
          if (callback)
            nextTick(next);
        }
        if (typeof callback !== "undefined") {
          next();
        } else {
          var res;
          while (true)
            if (typeof (res = next()) !== "undefined")
              return res || [];
        }
      }
      function _hash(s, salt, callback, progressCallback) {
        var err;
        if (typeof s !== "string" || typeof salt !== "string") {
          err = Error("Invalid string / salt: Not a string");
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        var minor, offset;
        if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
          err = Error("Invalid salt version: " + salt.substring(0, 2));
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        if (salt.charAt(2) === "$")
          minor = String.fromCharCode(0), offset = 3;
        else {
          minor = salt.charAt(2);
          if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
            err = Error("Invalid salt revision: " + salt.substring(2, 4));
            if (callback) {
              nextTick(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          offset = 4;
        }
        if (salt.charAt(offset + 2) > "$") {
          err = Error("Missing salt rounds");
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
        s += minor >= "a" ? "\0" : "";
        var passwordb = stringToBytes(s), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
        function finish(bytes) {
          var res = [];
          res.push("$2");
          if (minor >= "a")
            res.push(minor);
          res.push("$");
          if (rounds < 10)
            res.push("0");
          res.push(rounds.toString());
          res.push("$");
          res.push(base64_encode(saltb, saltb.length));
          res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
          return res.join("");
        }
        if (typeof callback == "undefined")
          return finish(_crypt(passwordb, saltb, rounds));
        else {
          _crypt(passwordb, saltb, rounds, function(err2, bytes) {
            if (err2)
              callback(err2, null);
            else
              callback(null, finish(bytes));
          }, progressCallback);
        }
      }
      bcrypt2.encodeBase64 = base64_encode;
      bcrypt2.decodeBase64 = base64_decode;
      return bcrypt2;
    });
  }
});

// node_modules/bcryptjs/index.js
var require_bcryptjs = __commonJS({
  "node_modules/bcryptjs/index.js"(exports, module) {
    module.exports = require_bcrypt();
  }
});

// node_modules/hono/dist/utils/url.js
var splitPath = (path2) => {
  const paths = path2.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path2 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path2);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path2) => {
  const groups = [];
  path2 = path2.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path: path2 };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
var getPath = (request) => {
  const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
  return match ? match[1] : "";
};
var getQueryStrings = (url) => {
  const queryIndex = url.indexOf("?", 8);
  return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
};
var mergePath = (...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path2 of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path2[0] !== "/") {
      path2 = `/${path2}`;
    }
    if (path2 === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path2 !== "/") {
      p = `${p}${path2}`;
    }
    if (path2 === "/" && p === "") {
      p = "/";
    }
  }
  return p;
};
var checkOptionalParameter = (path2) => {
  if (!path2.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path2.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
  const pairs = cookie.trim().split(";");
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      return parsedCookie;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      return parsedCookie;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent_(cookieValue);
    }
    return parsedCookie;
  }, {});
};
var _serialize = (name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain) {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite}`;
  }
  if (opt.partitioned) {
    cookie += "; Partitioned";
  }
  return cookie;
};
var serialize = (name, value, opt = {}) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/utils/stream.js
var StreamingApi = class {
  constructor(writable, _readable) {
    this.abortSubscribers = [];
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();
    const reader = _readable.getReader();
    this.responseReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        done ? controller.close() : controller.enqueue(value);
      },
      cancel: () => {
        this.abortSubscribers.forEach((subscriber) => subscriber());
      }
    });
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch (e) {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch (e) {
    }
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
  async onAbort(listener) {
    this.abortSubscribers.push(listener);
  }
};

// node_modules/hono/dist/context.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = (headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
};
var _status;
var _executionCtx;
var _headers;
var _preparedHeaders;
var _res;
var _isFresh;
var Context = class {
  constructor(req, options) {
    this.env = {};
    this._var = {};
    this.finalized = false;
    this.error = void 0;
    __privateAdd(this, _status, 200);
    __privateAdd(this, _executionCtx, void 0);
    __privateAdd(this, _headers, void 0);
    __privateAdd(this, _preparedHeaders, void 0);
    __privateAdd(this, _res, void 0);
    __privateAdd(this, _isFresh, true);
    this.renderer = (content) => this.html(content);
    this.notFoundHandler = () => new Response();
    this.render = (...args) => this.renderer(...args);
    this.setRenderer = (renderer) => {
      this.renderer = renderer;
    };
    this.header = (name, value, options2) => {
      if (value === void 0) {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).delete(name);
        } else if (__privateGet(this, _preparedHeaders)) {
          delete __privateGet(this, _preparedHeaders)[name.toLocaleLowerCase()];
        }
        if (this.finalized) {
          this.res.headers.delete(name);
        }
        return;
      }
      if (options2?.append) {
        if (!__privateGet(this, _headers)) {
          __privateSet(this, _isFresh, false);
          __privateSet(this, _headers, new Headers(__privateGet(this, _preparedHeaders)));
          __privateSet(this, _preparedHeaders, {});
        }
        __privateGet(this, _headers).append(name, value);
      } else {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).set(name, value);
        } else {
          __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
          __privateGet(this, _preparedHeaders)[name.toLowerCase()] = value;
        }
      }
      if (this.finalized) {
        if (options2?.append) {
          this.res.headers.append(name, value);
        } else {
          this.res.headers.set(name, value);
        }
      }
    };
    this.status = (status) => {
      __privateSet(this, _isFresh, false);
      __privateSet(this, _status, status);
    };
    this.set = (key, value) => {
      this._var ?? (this._var = {});
      this._var[key] = value;
    };
    this.get = (key) => {
      return this._var ? this._var[key] : void 0;
    };
    this.newResponse = (data, arg, headers) => {
      if (__privateGet(this, _isFresh) && !headers && !arg && __privateGet(this, _status) === 200) {
        return new Response(data, {
          headers: __privateGet(this, _preparedHeaders)
        });
      }
      if (arg && typeof arg !== "number") {
        const headers2 = setHeaders(new Headers(arg.headers), __privateGet(this, _preparedHeaders));
        return new Response(data, {
          headers: headers2,
          status: arg.status
        });
      }
      const status = typeof arg === "number" ? arg : __privateGet(this, _status);
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _headers) ?? __privateSet(this, _headers, new Headers());
      setHeaders(__privateGet(this, _headers), __privateGet(this, _preparedHeaders));
      if (__privateGet(this, _res)) {
        __privateGet(this, _res).headers.forEach((v, k) => {
          __privateGet(this, _headers)?.set(k, v);
        });
        setHeaders(__privateGet(this, _headers), __privateGet(this, _preparedHeaders));
      }
      headers ?? (headers = {});
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          __privateGet(this, _headers).set(k, v);
        } else {
          __privateGet(this, _headers).delete(k);
          for (const v2 of v) {
            __privateGet(this, _headers).append(k, v2);
          }
        }
      }
      return new Response(data, {
        status,
        headers: __privateGet(this, _headers)
      });
    };
    this.body = (data, arg, headers) => {
      return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
    };
    this.text = (text, arg, headers) => {
      if (!__privateGet(this, _preparedHeaders)) {
        if (__privateGet(this, _isFresh) && !headers && !arg) {
          return new Response(text);
        }
        __privateSet(this, _preparedHeaders, {});
      }
      __privateGet(this, _preparedHeaders)["content-type"] = TEXT_PLAIN;
      return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
    };
    this.json = (object, arg, headers) => {
      const body = JSON.stringify(object);
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)["content-type"] = "application/json; charset=UTF-8";
      return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
    };
    this.jsonT = (object, arg, headers) => {
      return this.json(object, arg, headers);
    };
    this.html = (html, arg, headers) => {
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)["content-type"] = "text/html; charset=UTF-8";
      if (typeof html === "object") {
        if (!(html instanceof Promise)) {
          html = html.toString();
        }
        if (html instanceof Promise) {
          return html.then((html2) => resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {})).then((html2) => {
            return typeof arg === "number" ? this.newResponse(html2, arg, headers) : this.newResponse(html2, arg);
          });
        }
      }
      return typeof arg === "number" ? this.newResponse(html, arg, headers) : this.newResponse(html, arg);
    };
    this.redirect = (location, status = 302) => {
      __privateGet(this, _headers) ?? __privateSet(this, _headers, new Headers());
      __privateGet(this, _headers).set("Location", location);
      return this.newResponse(null, status);
    };
    this.streamText = (cb, arg, headers) => {
      headers ?? (headers = {});
      this.header("content-type", TEXT_PLAIN);
      this.header("x-content-type-options", "nosniff");
      this.header("transfer-encoding", "chunked");
      return this.stream(cb, arg, headers);
    };
    this.stream = (cb, arg, headers) => {
      const { readable, writable } = new TransformStream();
      const stream = new StreamingApi(writable, readable);
      cb(stream).finally(() => stream.close());
      return typeof arg === "number" ? this.newResponse(stream.responseReadable, arg, headers) : this.newResponse(stream.responseReadable, arg);
    };
    this.cookie = (name, value, opt) => {
      const cookie = serialize(name, value, opt);
      this.header("set-cookie", cookie, { append: true });
    };
    this.notFound = () => {
      return this.notFoundHandler(this);
    };
    this.req = req;
    if (options) {
      __privateSet(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }
  get event() {
    if (__privateGet(this, _executionCtx) && "respondWith" in __privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (__privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    __privateSet(this, _isFresh, false);
    return __privateGet(this, _res) || __privateSet(this, _res, new Response("404 Not Found", { status: 404 }));
  }
  set res(_res2) {
    __privateSet(this, _isFresh, false);
    if (__privateGet(this, _res) && _res2) {
      __privateGet(this, _res).headers.delete("content-type");
      for (const [k, v] of __privateGet(this, _res).headers.entries()) {
        if (k === "set-cookie") {
          const cookies = __privateGet(this, _res).headers.getSetCookie();
          _res2.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res2.headers.append("set-cookie", cookie);
          }
        } else {
          _res2.headers.set(k, v);
        }
      }
    }
    __privateSet(this, _res, _res2);
    this.finalized = true;
  }
  get var() {
    return { ...this._var };
  }
  get runtime() {
    const global = globalThis;
    if (global?.Deno !== void 0) {
      return "deno";
    }
    if (global?.Bun !== void 0) {
      return "bun";
    }
    if (typeof global?.WebSocketPair === "function") {
      return "workerd";
    }
    if (typeof global?.EdgeRuntime === "string") {
      return "edge-light";
    }
    if (global?.fastly !== void 0) {
      return "fastly";
    }
    if (global?.__lagon__ !== void 0) {
      return "lagon";
    }
    if (global?.process?.release?.name === "node") {
      return "node";
    }
    return "other";
  }
};
_status = /* @__PURE__ */ new WeakMap();
_executionCtx = /* @__PURE__ */ new WeakMap();
_headers = /* @__PURE__ */ new WeakMap();
_preparedHeaders = /* @__PURE__ */ new WeakMap();
_res = /* @__PURE__ */ new WeakMap();
_isFresh = /* @__PURE__ */ new WeakMap();

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (!handler) {
        if (context instanceof Context && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  constructor(status = 500, options) {
    super(options?.message);
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = { all: false }) => {
  const contentType = request.headers.get("Content-Type");
  if (isFormDataContent(contentType)) {
    return parseFormData(request, options);
  }
  return {};
};
function isFormDataContent(contentType) {
  if (contentType === null) {
    return false;
  }
  return contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded");
}
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = {};
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] && isArrayField(form[key])) {
    appendToExistingArray(form[key], value);
  } else if (form[key]) {
    convertToNewArray(form, key, value);
  } else {
    form[key] = value;
  }
};
function isArrayField(field) {
  return Array.isArray(field);
}
var appendToExistingArray = (arr, value) => {
  arr.push(value);
};
var convertToNewArray = (form, key, value) => {
  form[key] = [form[key], value];
};

// node_modules/hono/dist/request.js
var __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet2 = (obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet2 = (obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _validatedData;
var _matchResult;
var HonoRequest = class {
  constructor(request, path2 = "/", matchResult = [[]]) {
    __privateAdd2(this, _validatedData, void 0);
    __privateAdd2(this, _matchResult, void 0);
    this.routeIndex = 0;
    this.bodyCache = {};
    this.cachedBody = (key) => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      if (bodyCache.arrayBuffer) {
        return (async () => {
          return await new Response(bodyCache.arrayBuffer)[key]();
        })();
      }
      return bodyCache[key] = raw2[key]();
    };
    this.raw = request;
    this.path = path2;
    __privateSet2(this, _matchResult, matchResult);
    __privateSet2(this, _validatedData, {});
  }
  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }
  getDecodedParam(key) {
    const paramKey = __privateGet2(this, _matchResult)[0][this.routeIndex][1][key];
    const param = this.getParamValue(paramKey);
    return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : void 0;
  }
  getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(__privateGet2(this, _matchResult)[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.getParamValue(__privateGet2(this, _matchResult)[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }
  getParamValue(paramKey) {
    return __privateGet2(this, _matchResult)[1] ? __privateGet2(this, _matchResult)[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  cookie(key) {
    const cookie = this.raw.headers.get("Cookie");
    if (!cookie) {
      return;
    }
    const obj = parse(cookie);
    if (key) {
      const value = obj[key];
      return value;
    } else {
      return obj;
    }
  }
  async parseBody(options) {
    if (this.bodyCache.parsedBody) {
      return this.bodyCache.parsedBody;
    }
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    __privateGet2(this, _validatedData)[target] = data;
  }
  valid(target) {
    return __privateGet2(this, _validatedData)[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route);
  }
  get routePath() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
  get headers() {
    return this.raw.headers;
  }
  get body() {
    return this.raw.body;
  }
  get bodyUsed() {
    return this.raw.bodyUsed;
  }
  get integrity() {
    return this.raw.integrity;
  }
  get keepalive() {
    return this.raw.keepalive;
  }
  get referrer() {
    return this.raw.referrer;
  }
  get signal() {
    return this.raw.signal;
  }
};
_validatedData = /* @__PURE__ */ new WeakMap();
_matchResult = /* @__PURE__ */ new WeakMap();

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/hono-base.js
var __accessCheck3 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet3 = (obj, member, getter) => {
  __accessCheck3(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd3 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet3 = (obj, member, value, setter) => {
  __accessCheck3(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var COMPOSED_HANDLER = Symbol("composedHandler");
function defineDynamicClass() {
  return class {
  };
}
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  const message = "Internal Server Error";
  return c.text(message, 500);
};
var _path;
var _Hono = class extends defineDynamicClass() {
  constructor(options = {}) {
    super();
    this._basePath = "/";
    __privateAdd3(this, _path, "/");
    this.routes = [];
    this.notFoundHandler = notFoundHandler;
    this.errorHandler = errorHandler;
    this.onError = (handler) => {
      this.errorHandler = handler;
      return this;
    };
    this.notFound = (handler) => {
      this.notFoundHandler = handler;
      return this;
    };
    this.head = () => {
      console.warn("`app.head()` is no longer used. `app.get()` implicitly handles the HEAD method.");
      return this;
    };
    this.handleEvent = (event) => {
      return this.dispatch(event.request, event, void 0, event.request.method);
    };
    this.fetch = (request, Env, executionCtx) => {
      return this.dispatch(request, executionCtx, Env, request.method);
    };
    this.request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        if (requestInit !== void 0) {
          input = new Request(input, requestInit);
        }
        return this.fetch(input, Env, executionCtx);
      }
      input = input.toString();
      const path2 = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
      const req = new Request(path2, requestInit);
      return this.fetch(req, Env, executionCtx);
    };
    this.fire = () => {
      addEventListener("fetch", (event) => {
        event.respondWith(this.dispatch(event.request, event, void 0, event.request.method));
      });
    };
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.map((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          __privateSet3(this, _path, args1);
        } else {
          this.addRoute(method, __privateGet3(this, _path), args1);
        }
        args.map((handler) => {
          if (typeof handler !== "string") {
            this.addRoute(method, __privateGet3(this, _path), handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path2, ...handlers) => {
      if (!method) {
        return this;
      }
      __privateSet3(this, _path, path2);
      for (const m of [method].flat()) {
        handlers.map((handler) => {
          this.addRoute(m.toUpperCase(), __privateGet3(this, _path), handler);
        });
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        __privateSet3(this, _path, arg1);
      } else {
        handlers.unshift(arg1);
      }
      handlers.map((handler) => {
        this.addRoute(METHOD_NAME_ALL, __privateGet3(this, _path), handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  route(path2, app2) {
    const subApp = this.basePath(path2);
    if (!app2) {
      return subApp;
    }
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path2) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path2);
    return subApp;
  }
  showRoutes() {
    const length = 8;
    this.routes.map((route) => {
      console.log(
        `\x1B[32m${route.method}\x1B[0m ${" ".repeat(length - route.method.length)} ${route.path}`
      );
    });
  }
  mount(path2, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path2);
    const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
    const handler = async (c, next) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      const options = optionHandler ? optionHandler(c) : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(
        new Request(
          new URL((c.req.path.slice(pathPrefixLength) || "/") + queryStrings, c.req.url),
          c.req.raw
        ),
        ...optionsArray
      );
      if (res) {
        return res;
      }
      await next();
    };
    this.addRoute(METHOD_NAME_ALL, mergePath(path2, "*"), handler);
    return this;
  }
  get routerName() {
    this.matchRoute("GET", "/");
    return this.router.name;
  }
  addRoute(method, path2, handler) {
    method = method.toUpperCase();
    path2 = mergePath(this._basePath, path2);
    const r = { path: path2, method, handler };
    this.router.add(method, path2, [handler, r]);
    this.routes.push(r);
  }
  matchRoute(method, path2) {
    return this.router.match(method, path2);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request, executionCtx, env, "GET")))();
    }
    const path2 = this.getPath(request, { env });
    const matchResult = this.matchRoute(method, path2);
    const c = new Context(new HonoRequest(request, path2, matchResult), {
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.notFoundHandler(c))
      ).catch((err) => this.handleError(err, c)) : res;
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. You may forget returning Response object or `await next()`"
          );
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
};
var Hono = _Hono;
_path = /* @__PURE__ */ new WeakMap();

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  constructor() {
    this.children = {};
  }
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node();
        if (name !== "") {
          node.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  constructor() {
    this.context = { varIndex: 0 };
    this.root = new Node();
  }
  insert(path2, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path2 = path2.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path2.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var methodNames = [METHOD_NAME_ALL, ...METHODS].map((method) => method.toUpperCase());
var emptyParam = [];
var nullMatcher = [/^$/, [], {}];
var wildcardRegExpCache = {};
function buildWildcardRegExp(path2) {
  return wildcardRegExpCache[path2] ?? (wildcardRegExpCache[path2] = new RegExp(
    path2 === "*" ? "" : `^${path2.replace(/\/\*/, "(?:|/.*)")}$`
  ));
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = {};
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = {};
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path2, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path2] = [handlers.map(([h]) => [h, {}]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path2, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path2) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = {};
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path2) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path2)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  constructor() {
    this.name = "RegExpRouter";
    this.middleware = { [METHOD_NAME_ALL]: {} };
    this.routes = { [METHOD_NAME_ALL]: {} };
  }
  add(method, path2, handler) {
    var _a;
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (methodNames.indexOf(method) === -1) {
      methodNames.push(method);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = {};
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path2 === "/*") {
      path2 = "*";
    }
    const paramCount = (path2.match(/\/:/g) || []).length;
    if (/\*$/.test(path2)) {
      const re = buildWildcardRegExp(path2);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          var _a2;
          (_a2 = middleware[m])[path2] || (_a2[path2] = findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []);
        });
      } else {
        (_a = middleware[method])[path2] || (_a[path2] = findMiddleware(middleware[method], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []);
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path2) || [path2];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path22 = paths[i];
      Object.keys(routes).forEach((m) => {
        var _a2;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a2 = routes[m])[path22] || (_a2[path22] = [
            ...findMiddleware(middleware[m], path22) || findMiddleware(middleware[METHOD_NAME_ALL], path22) || []
          ]);
          routes[m][path22].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path2) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path22) => {
      const matcher = matchers[method2];
      const staticMatch = matcher[2][path22];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path22.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path2);
  }
  buildAllMatchers() {
    const matchers = {};
    methodNames.forEach((method) => {
      matchers[method] = this.buildMatcher(method) || matchers[METHOD_NAME_ALL];
    });
    this.middleware = this.routes = void 0;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path2) => [path2, r[method][path2]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute || (hasOwnRoute = true);
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path2) => [path2, r[METHOD_NAME_ALL][path2]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  constructor(init) {
    this.name = "SmartRouter";
    this.routers = [];
    this.routes = [];
    Object.assign(this, init);
  }
  add(method, path2, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path2, handler]);
  }
  match(method, path2) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach((args) => {
          router.add(...args);
        });
        res = router.match(method, path2);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  constructor(method, handler, children) {
    this.order = 0;
    this.params = {};
    this.children = children || {};
    this.methods = [];
    this.name = "";
    if (method && handler) {
      const m = {};
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path2, handler) {
    this.name = `${method} ${path2}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path2);
    const possibleKeys = [];
    const parentPatterns = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        parentPatterns.push(...curNode.patterns);
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        parentPatterns.push(...curNode.patterns);
        possibleKeys.push(pattern[1]);
      }
      parentPatterns.push(...curNode.patterns);
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = {};
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.methods.length; i < len; i++) {
      const m = node.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = {};
        handlerSet.possibleKeys.forEach((key) => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path2) {
    const handlerSets = [];
    this.params = {};
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path2);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.children[part];
        if (nextNode) {
          nextNode.params = node.params;
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(...this.gHSets(nextNode.children["*"], method, node.params, {}));
            }
            handlerSets.push(...this.gHSets(nextNode, method, node.params, {}));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.patterns.length; k < len3; k++) {
          const pattern = node.patterns[k];
          const params = { ...node.params };
          if (pattern === "*") {
            const astNode = node.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node.params, {}));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, node.params, params));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, params, node.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, params, node.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  constructor() {
    this.name = "TrieRouter";
    this.node = new Node2();
  }
  add(method, path2, handler) {
    const results = checkOptionalParameter(path2);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path2, handler);
  }
  match(method, path2) {
    return this.node.search(method, path2);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    const obj2 = parse(cookie, key);
    return obj2[key];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};
var setCookie = (c, name, value, opt) => {
  const cookie = serialize(name, value, { path: "/", ...opt });
  c.header("set-cookie", cookie, { append: true });
};
var deleteCookie = (c, name, opt) => {
  setCookie(c, name, "", { ...opt, maxAge: 0 });
};

// src/database.js
var Database = class {
  constructor(d1) {
    this.d1 = d1;
  }
  async initDB() {
    await this.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                is_admin INTEGER DEFAULT 0,
                max_storage_bytes INTEGER DEFAULT 1073741824
            );
        `);
    await this.run(`
            CREATE TABLE IF NOT EXISTS folders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                parent_id INTEGER,
                user_id INTEGER NOT NULL,
                password TEXT,
                is_deleted INTEGER DEFAULT 0,
                deleted_at INTEGER,
                share_token TEXT,
                share_expires_at INTEGER,
                share_password TEXT,
                created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                UNIQUE(name, parent_id, user_id)
            );
        `);
    await this.run(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id TEXT NOT NULL,
                fileName TEXT NOT NULL,
                mimetype TEXT,
                file_id TEXT NOT NULL,
                thumb_file_id TEXT,
                date INTEGER,
                size INTEGER,
                folder_id INTEGER,
                user_id INTEGER NOT NULL,
                storage_type TEXT,
                is_deleted INTEGER DEFAULT 0,
                deleted_at INTEGER,
                share_token TEXT,
                share_expires_at INTEGER,
                share_password TEXT
            );
        `);
    await this.run(`
            CREATE TABLE IF NOT EXISTS auth_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expires_at INTEGER NOT NULL
            );
        `);
    console.log("\u6570\u636E\u5E93\u7ED3\u6784\u521D\u59CB\u5316\u5B8C\u6210 (\u5DF2\u5305\u542B\u5206\u4EAB\u4E0E\u56DE\u6536\u7AD9\u5B57\u6BB5)\u3002");
  }
  // 封装 D1 的 prepare 和 bind
  async run(sql, params = []) {
    try {
      const stmt = this.d1.prepare(sql).bind(...params);
      return await stmt.run();
    } catch (e) {
      console.error(`SQL \u6267\u884C\u9519\u8BEF: ${sql}`, e);
      throw new Error("\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: " + e.message);
    }
  }
  async get(sql, params = []) {
    try {
      const stmt = this.d1.prepare(sql).bind(...params);
      return await stmt.first();
    } catch (e) {
      console.error(`SQL \u67E5\u8BE2\u9519\u8BEF (get): ${sql}`, e);
      throw e;
    }
  }
  async all(sql, params = []) {
    try {
      const stmt = this.d1.prepare(sql).bind(...params);
      const result = await stmt.all();
      return result.results || [];
    } catch (e) {
      console.error(`SQL \u67E5\u8BE2\u9519\u8BEF (all): ${sql}`, e);
      throw e;
    }
  }
  // 批量执行 (用于事务或迁移)
  async batch(statements) {
    try {
      return await this.d1.batch(statements);
    } catch (e) {
      console.error("\u6279\u91CF\u64CD\u4F5C\u5931\u8D25", e);
      throw e;
    }
  }
};

// src/config.js
var ConfigManager = class {
  constructor(kv) {
    this.kv = kv;
    this.cache = null;
  }
  async load() {
    if (this.cache)
      return this.cache;
    try {
      const data = await this.kv.get("config", { type: "json" });
      this.cache = data || {
        storageMode: "",
        // 移除默认 'local'，留空迫使用户配置
        s3: {},
        webdav: {},
        telegram: {}
      };
    } catch (e) {
      console.error("Config Load Error:", e);
      this.cache = {};
    }
    return this.cache;
  }
  async save(newConfig) {
    const current = await this.load();
    const updated = {
      ...current,
      ...newConfig,
      // 针对嵌套对象进行合并 (s3, webdav, telegram)
      s3: { ...current.s3 || {}, ...newConfig.s3 || {} },
      webdav: { ...current.webdav || {}, ...newConfig.webdav || {} },
      telegram: { ...current.telegram || {}, ...newConfig.telegram || {} }
    };
    await this.kv.put("config", JSON.stringify(updated));
    this.cache = updated;
    return true;
  }
};

// src/data.js
var import_bcryptjs = __toESM(require_bcryptjs(), 1);
import path from "node:path";

// src/crypto.js
import { Buffer as Buffer2 } from "node:buffer";
import crypto2 from "node:crypto";
var SECRET_KEY = crypto2.createHash("sha256").update("default-fallback-key-2024-secure").digest();
var IV_LENGTH = 16;
function initCrypto(secret) {
  try {
    if (secret) {
      const secretStr = String(secret);
      SECRET_KEY = crypto2.createHash("sha256").update(secretStr).digest();
    }
  } catch (e) {
    console.error("Crypto Init Warning:", e);
  }
}
function encrypt(text) {
  if (text === null || text === void 0)
    return null;
  try {
    const iv = crypto2.randomBytes(IV_LENGTH);
    const cipher = crypto2.createCipheriv("aes-256-cbc", SECRET_KEY, iv);
    const inputBuffer = Buffer2.from(String(text));
    let encrypted = cipher.update(inputBuffer);
    encrypted = Buffer2.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (e) {
    console.error("Encrypt error:", e);
    return null;
  }
}
function decrypt(text) {
  if (!text)
    return null;
  try {
    const textParts = text.split(":");
    if (textParts.length !== 2)
      return null;
    const iv = Buffer2.from(textParts.shift(), "hex");
    const encryptedText = Buffer2.from(textParts.join(":"), "hex");
    const decipher = crypto2.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer2.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    return null;
  }
}

// src/data.js
var ALL_FILE_COLUMNS = `
    fileName, mimetype, file_id, thumb_file_id, date, size, folder_id, user_id, storage_type, is_deleted, deleted_at
`;
var SAFE_SELECT_MESSAGE_ID = `CAST(message_id AS TEXT) AS message_id`;
var SAFE_SELECT_ID_AS_TEXT = `CAST(message_id AS TEXT) AS id`;
async function getUniqueName(db, folderId, originalName, userId, type) {
  const table = type === "file" ? "files" : "folders";
  const col = type === "file" ? "fileName" : "name";
  const parentCol = type === "file" ? "folder_id" : "parent_id";
  const exists = await db.get(
    `SELECT 1 as exists_flag FROM ${table} WHERE ${col} = ? AND ${parentCol} = ? AND user_id = ? AND deleted_at IS NULL`,
    [originalName, folderId, userId]
  );
  if (!exists)
    return originalName;
  let name = originalName;
  let ext = "";
  if (type === "file") {
    const lastDotIndex = originalName.lastIndexOf(".");
    if (lastDotIndex !== -1 && lastDotIndex !== 0) {
      name = originalName.substring(0, lastDotIndex);
      ext = originalName.substring(lastDotIndex);
    }
  }
  let counter = 1;
  while (true) {
    const newName = `${name} (${counter})${ext}`;
    const check = await db.get(
      `SELECT 1 as exists_flag FROM ${table} WHERE ${col} = ? AND ${parentCol} = ? AND user_id = ? AND deleted_at IS NULL`,
      [newName, folderId, userId]
    );
    if (!check)
      return newName;
    counter++;
  }
}
function formatSize(bytes) {
  if (bytes === 0)
    return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
async function createUser(db, username, hashedPassword) {
  const sql = `INSERT INTO users (username, password, is_admin, max_storage_bytes) VALUES (?, ?, 0, 1073741824)`;
  const result = await db.run(sql, [username, hashedPassword]);
  let newId = result?.meta?.last_row_id;
  if (!newId) {
    const u = await findUserByName(db, username);
    newId = u.id;
  }
  return { id: newId, username };
}
async function findUserByName(db, username) {
  return await db.get("SELECT * FROM users WHERE username = ?", [username]);
}
async function changeUserPassword(db, userId, newHashedPassword) {
  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  const result = await db.run(sql, [newHashedPassword, userId]);
  return { success: true, changes: result.meta.changes };
}
async function listAllUsers(db) {
  const sql = `SELECT id, username FROM users ORDER BY username ASC`;
  return await db.all(sql);
}
async function deleteUser(db, userId) {
  const sql = `DELETE FROM users WHERE id = ? AND is_admin = 0`;
  const result = await db.run(sql, [userId]);
  return { success: true, changes: result.meta.changes };
}
async function getUserQuota(db, userId) {
  const user = await db.get("SELECT max_storage_bytes FROM users WHERE id = ?", [userId]);
  const usage = await db.get("SELECT SUM(size) as total_size FROM files WHERE user_id = ? AND deleted_at IS NULL", [userId]);
  return {
    max: user ? user.max_storage_bytes || 1073741824 : 1073741824,
    used: usage && usage.total_size ? usage.total_size : 0
  };
}
async function checkQuota(db, userId, incomingSize) {
  const quota = await getUserQuota(db, userId);
  if (quota.max === 0)
    return true;
  return quota.used + incomingSize <= quota.max;
}
async function listAllUsersWithQuota(db) {
  const sql = `SELECT id, username, is_admin, max_storage_bytes FROM users ORDER BY is_admin DESC, username ASC`;
  const users = await db.all(sql);
  if (users.length === 0)
    return [];
  const userIds = users.map((u) => u.id);
  const placeholders = userIds.map(() => "?").join(",");
  const usageSql = `SELECT user_id, SUM(size) as total_size FROM files WHERE user_id IN (${placeholders}) AND deleted_at IS NULL GROUP BY user_id`;
  const usageData = await db.all(usageSql, userIds);
  const usageMap = new Map(usageData.map((row) => [row.user_id, row.total_size]));
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    is_admin: user.is_admin,
    max_storage_bytes: user.max_storage_bytes || 1073741824,
    used_storage_bytes: usageMap.get(user.id) || 0
  }));
}
async function setMaxStorageForUser(db, userId, maxBytes) {
  const sql = `UPDATE users SET max_storage_bytes = ? WHERE id = ? AND is_admin = 0`;
  const result = await db.run(sql, [maxBytes, userId]);
  return { success: true, changes: result.meta.changes };
}
async function addFile(db, fileData, folderId = 1, userId, storageType) {
  const { message_id, fileName, mimetype, file_id, thumb_file_id, date, size } = fileData;
  const sql = `INSERT INTO files (message_id, fileName, mimetype, file_id, thumb_file_id, date, size, folder_id, user_id, storage_type, is_deleted)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;
  const result = await db.run(sql, [message_id, fileName, mimetype, file_id, thumb_file_id, date, size, folderId, userId, storageType]);
  return { success: true, id: result.meta.last_row_id || 0, fileId: message_id };
}
async function updateFile(db, fileId, updates, userId) {
  const fields = [];
  const values = [];
  const validKeys = ["fileName", "mimetype", "file_id", "thumb_file_id", "size", "date", "message_id"];
  for (const key in updates) {
    if (Object.hasOwnProperty.call(updates, key) && validKeys.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  }
  fields.push("is_deleted = 0");
  fields.push("deleted_at = NULL");
  if (fields.length === 0)
    return { success: true, changes: 0 };
  values.push(fileId, userId);
  const sql = `UPDATE files SET ${fields.join(", ")} WHERE message_id = ? AND user_id = ?`;
  const result = await db.run(sql, values);
  return { success: true, changes: result.meta.changes };
}
async function getFilesByIds(db, messageIds, userId) {
  if (!messageIds || messageIds.length === 0)
    return [];
  const placeholders = messageIds.map(() => "?").join(",");
  const sql = `SELECT ${SAFE_SELECT_MESSAGE_ID}, ${ALL_FILE_COLUMNS} FROM files WHERE message_id IN (${placeholders}) AND user_id = ?`;
  return await db.all(sql, [...messageIds, userId]);
}
async function createFolder(db, name, parentId, userId) {
  const sql = `INSERT INTO folders (name, parent_id, user_id, is_deleted) VALUES (?, ?, ?, 0)`;
  try {
    const result = await db.run(sql, [name, parentId, userId]);
    let newId = result?.meta?.last_row_id;
    if (!newId) {
      let querySql = "";
      let params = [];
      if (parentId === null) {
        querySql = "SELECT id FROM folders WHERE name = ? AND parent_id IS NULL AND user_id = ?";
        params = [name, userId];
      } else {
        querySql = "SELECT id FROM folders WHERE name = ? AND parent_id = ? AND user_id = ?";
        params = [name, parentId, userId];
      }
      const row = await db.get(querySql, params);
      if (row)
        newId = row.id;
    }
    return { success: true, id: newId };
  } catch (err) {
    if (err.message && err.message.includes("UNIQUE")) {
      let row;
      const whereClause = parentId === null ? "parent_id IS NULL" : "parent_id = ?";
      const params = parentId === null ? [name, userId] : [name, parentId, userId];
      row = await db.get(`SELECT id, deleted_at FROM folders WHERE name = ? AND ${whereClause} AND user_id = ?`, params);
      if (row) {
        if (row.deleted_at !== null) {
          const trashName = `${name}_deleted_${Date.now()}`;
          await db.run("UPDATE folders SET name = ? WHERE id = ?", [trashName, row.id]);
          const retryResult = await db.run(sql, [name, parentId, userId]);
          return { success: true, id: retryResult.meta.last_row_id };
        } else {
          throw new Error("\u6587\u4EF6\u5939\u5DF2\u5B58\u5728");
        }
      }
      throw err;
    }
    throw err;
  }
}
async function getFolder(db, folderId, userId) {
  return await db.get("SELECT * FROM folders WHERE id = ? AND user_id = ?", [folderId, userId]);
}
async function getFolderContents(db, folderId, userId) {
  const sqlFolders = `SELECT id, name, parent_id, 'folder' as type, password IS NOT NULL as is_locked FROM folders WHERE parent_id = ? AND user_id = ? AND deleted_at IS NULL ORDER BY name ASC`;
  const sqlFiles = `SELECT ${SAFE_SELECT_MESSAGE_ID}, ${ALL_FILE_COLUMNS}, ${SAFE_SELECT_ID_AS_TEXT}, fileName as name, 'file' as type FROM files WHERE folder_id = ? AND user_id = ? AND deleted_at IS NULL ORDER BY name ASC`;
  const folders = await db.all(sqlFolders, [folderId, userId]);
  const files = await db.all(sqlFiles, [folderId, userId]);
  return {
    folders: folders.map((f) => ({ ...f, encrypted_id: encrypt(f.id) })),
    files
  };
}
async function getRootFolder(db, userId) {
  return await db.get("SELECT id FROM folders WHERE user_id = ? AND parent_id IS NULL", [userId]);
}
async function getFolderPath(db, folderId, userId) {
  let pathArr = [];
  let currentId = folderId;
  while (currentId) {
    const folder = await db.get("SELECT id, name, parent_id FROM folders WHERE id = ? AND user_id = ?", [currentId, userId]);
    if (folder) {
      pathArr.unshift({ id: folder.id, name: folder.name, encrypted_id: encrypt(folder.id) });
      currentId = folder.parent_id;
    } else {
      break;
    }
  }
  return pathArr;
}
async function getAllFolders(db, userId) {
  const sql = "SELECT id, name, parent_id FROM folders WHERE user_id = ? AND deleted_at IS NULL ORDER BY parent_id, name ASC";
  const rows = await db.all(sql, [userId]);
  return rows.map((folder) => ({ ...folder, encrypted_id: encrypt(folder.id) }));
}
async function searchItems(db, query, userId) {
  const searchQuery = `%${query}%`;
  const baseQuery = `
        WITH RECURSIVE folder_ancestry(id, parent_id, is_locked, is_deleted) AS (
            SELECT id, parent_id, (password IS NOT NULL) as is_locked, is_deleted
            FROM folders WHERE user_id = ?
            UNION ALL
            SELECT fa.id, f.parent_id, (fa.is_locked OR (f.password IS NOT NULL)), (fa.is_deleted OR f.is_deleted)
            FROM folders f JOIN folder_ancestry fa ON f.id = fa.parent_id WHERE f.user_id = ?
        ),
        folder_status AS ( SELECT id, MAX(is_locked) as is_path_locked, MAX(is_deleted) as is_path_deleted FROM folder_ancestry GROUP BY id )
    `;
  const sqlFiles = baseQuery + `
        SELECT ${SAFE_SELECT_MESSAGE_ID}, ${ALL_FILE_COLUMNS}, ${SAFE_SELECT_ID_AS_TEXT}, f.fileName as name, 'file' as type
        FROM files f JOIN folder_status fs ON f.folder_id = fs.id
        WHERE f.fileName LIKE ? AND f.user_id = ? AND fs.is_path_locked = 0 
        AND f.deleted_at IS NULL
        ORDER BY f.date DESC;
    `;
  const sqlFolders = baseQuery + `
        SELECT f.id, f.name, f.parent_id, 'folder' as type, (f.password IS NOT NULL) as is_locked
        FROM folders f JOIN folder_status fs ON f.id = fs.id
        WHERE f.name LIKE ? AND f.user_id = ? AND fs.is_path_locked = 0 
        AND f.deleted_at IS NULL
        AND f.parent_id IS NOT NULL
        ORDER BY f.name ASC;
    `;
  const folders = await db.all(sqlFolders, [userId, userId, searchQuery, userId]);
  const files = await db.all(sqlFiles, [userId, userId, searchQuery, userId]);
  return { folders: folders.map((f) => ({ ...f, encrypted_id: encrypt(f.id) })), files };
}
async function unifiedDelete(db, storage, itemId, itemType, userId, explicitFileIds = null, explicitFolderIds = null) {
  let checkIds = [];
  if (explicitFolderIds && explicitFolderIds.length > 0) {
    checkIds = explicitFolderIds;
  } else if (itemType === "folder" && itemId) {
    checkIds = [itemId];
  }
  if (checkIds.length > 0) {
    const placeholders = checkIds.map(() => "?").join(",");
    const locked = await db.all(
      `SELECT name FROM folders WHERE id IN (${placeholders}) AND password IS NOT NULL AND password != '' AND user_id = ?`,
      [...checkIds, userId]
    );
    if (locked.length > 0) {
      throw new Error(`\u6587\u4EF6\u5939 "${locked[0].name}" \u5DF2\u52A0\u5BC6\u4FDD\u62A4\uFF0C\u65E0\u6CD5\u6C38\u4E45\u5220\u9664\u3002\u8BF7\u5148\u79FB\u9664\u5BC6\u7801\u3002`);
    }
  }
  let filesForStorage = [];
  let foldersForStorage = [];
  if (explicitFileIds || explicitFolderIds) {
    if (explicitFileIds && explicitFileIds.length > 0)
      filesForStorage.push(...await getFilesByIds(db, explicitFileIds, userId));
    if (explicitFolderIds && explicitFolderIds.length > 0) {
      for (const fid of explicitFolderIds) {
        const deletionData = await getFolderDeletionData(db, fid, userId);
        filesForStorage.push(...deletionData.files);
        foldersForStorage.push(...deletionData.folders);
      }
    }
  } else {
    if (itemType === "folder") {
      const deletionData = await getFolderDeletionData(db, itemId, userId);
      filesForStorage.push(...deletionData.files);
      foldersForStorage.push(...deletionData.folders);
    } else {
      filesForStorage.push(...await getFilesByIds(db, [itemId], userId));
    }
  }
  if (storage && storage.remove) {
    try {
      await storage.remove(filesForStorage, foldersForStorage, userId);
    } catch (err) {
      console.error("\u5B9E\u4F53\u5220\u9664\u5931\u8D25:", err);
    }
  }
  const fileIdsToDelete = filesForStorage.map((f) => f.message_id);
  let folderIdsToDelete = foldersForStorage.map((f) => f.id);
  if (explicitFolderIds)
    folderIdsToDelete = [.../* @__PURE__ */ new Set([...folderIdsToDelete, ...explicitFolderIds])];
  else if (itemType === "folder")
    folderIdsToDelete.push(itemId);
  await executeDeletion(db, fileIdsToDelete, folderIdsToDelete, userId);
}
async function getFolderDeletionData(db, folderId, userId) {
  let filesToDelete = [];
  let foldersToDeleteIds = [folderId];
  async function findContentsRecursive(currentFolderId) {
    const sqlFiles = `SELECT ${SAFE_SELECT_MESSAGE_ID}, ${ALL_FILE_COLUMNS} FROM files WHERE folder_id = ? AND user_id = ?`;
    const files = await db.all(sqlFiles, [currentFolderId, userId]);
    filesToDelete.push(...files);
    const sqlFolders = `SELECT id FROM folders WHERE parent_id = ? AND user_id = ?`;
    const subFolders = await db.all(sqlFolders, [currentFolderId, userId]);
    for (const subFolder of subFolders) {
      foldersToDeleteIds.push(subFolder.id);
      await findContentsRecursive(subFolder.id);
    }
  }
  await findContentsRecursive(folderId);
  const foldersToDelete = foldersToDeleteIds.map((id) => ({ id }));
  return { files: filesToDelete, folders: foldersToDelete };
}
async function executeDeletion(db, fileIds, folderIds, userId) {
  if (fileIds.length === 0 && folderIds.length === 0)
    return { success: true };
  if (fileIds.length > 0) {
    const place = fileIds.map(() => "?").join(",");
    await db.run(`DELETE FROM files WHERE message_id IN (${place}) AND user_id = ?`, [...fileIds, userId]);
  }
  if (folderIds.length > 0) {
    const place = Array.from(new Set(folderIds)).map(() => "?").join(",");
    await db.run(`DELETE FROM folders WHERE id IN (${place}) AND user_id = ?`, [...new Set(folderIds), userId]);
  }
  return { success: true };
}
async function softDeleteItems(db, fileIds = [], folderIds = [], userId) {
  if (folderIds && folderIds.length > 0) {
    const placeholders = folderIds.map(() => "?").join(",");
    const locked = await db.all(
      `SELECT name FROM folders WHERE id IN (${placeholders}) AND password IS NOT NULL AND password != '' AND user_id = ?`,
      [...folderIds, userId]
    );
    if (locked.length > 0) {
      throw new Error(`\u6587\u4EF6\u5939 "${locked[0].name}" \u5DF2\u52A0\u5BC6\u4FDD\u62A4\uFF0C\u65E0\u6CD5\u5220\u9664\u3002\u8BF7\u5148\u79FB\u9664\u5BC6\u7801\uFF08\u89E3\u5BC6\uFF09\u3002`);
    }
  }
  const now = Date.now();
  let targetFileIds = new Set(fileIds || []);
  let targetFolderIds = new Set(folderIds || []);
  if (folderIds && folderIds.length > 0) {
    for (const folderId of folderIds) {
      const data = await getFolderDeletionData(db, folderId, userId);
      data.files.forEach((f) => targetFileIds.add(f.message_id));
      data.folders.forEach((f) => targetFolderIds.add(f.id));
    }
  }
  const finalFileIds = Array.from(targetFileIds);
  const finalFolderIds = Array.from(targetFolderIds);
  if (finalFileIds.length > 0) {
    const place = finalFileIds.map(() => "?").join(",");
    await db.run(`UPDATE files SET is_deleted = 1, deleted_at = ? WHERE message_id IN (${place}) AND user_id = ?`, [now, ...finalFileIds, userId]);
  }
  if (finalFolderIds.length > 0) {
    const place = finalFolderIds.map(() => "?").join(",");
    await db.run(`UPDATE folders SET is_deleted = 1, deleted_at = ? WHERE id IN (${place}) AND user_id = ?`, [now, ...finalFolderIds, userId]);
  }
  return { success: true };
}
async function checkRestoreConflicts(db, fileIds = [], folderIds = [], userId) {
  const conflicts = [];
  for (const id of fileIds) {
    const file = await db.get("SELECT fileName, folder_id FROM files WHERE message_id = ? AND user_id = ?", [id, userId]);
    if (file) {
      const existing = await db.get(
        "SELECT 1 FROM files WHERE folder_id = ? AND fileName = ? AND user_id = ? AND deleted_at IS NULL",
        [file.folder_id, file.fileName, userId]
      );
      if (existing)
        conflicts.push(file.fileName);
    }
  }
  for (const id of folderIds) {
    const folder = await db.get("SELECT name, parent_id FROM folders WHERE id = ? AND user_id = ?", [id, userId]);
    if (folder) {
      const existing = await db.get(
        "SELECT 1 FROM folders WHERE parent_id = ? AND name = ? AND user_id = ? AND deleted_at IS NULL",
        [folder.parent_id, folder.name, userId]
      );
      if (existing)
        conflicts.push(folder.name);
    }
  }
  return conflicts;
}
async function restoreItems(db, storage, fileIds = [], folderIds = [], userId, conflictMode = "rename") {
  let targetFileIds = new Set(fileIds || []);
  let targetFolderIds = new Set(folderIds || []);
  if (folderIds && folderIds.length > 0) {
    for (const folderId of folderIds) {
      const data = await getFolderDeletionData(db, folderId, userId);
      data.files.forEach((f) => targetFileIds.add(f.message_id));
      data.folders.forEach((f) => targetFolderIds.add(f.id));
    }
  }
  for (const id of folderIds || []) {
    const folder = await db.get("SELECT id, name, parent_id FROM folders WHERE id = ? AND user_id = ?", [id, userId]);
    if (folder) {
      const existingFolder = await db.get(
        "SELECT id FROM folders WHERE parent_id = ? AND name = ? AND user_id = ? AND deleted_at IS NULL",
        [folder.parent_id, folder.name, userId]
      );
      if (existingFolder) {
        if (conflictMode === "overwrite") {
          await softDeleteItems(db, [], [existingFolder.id], userId);
        } else if (conflictMode === "skip") {
          targetFolderIds.delete(id);
          const data = await getFolderDeletionData(db, id, userId);
          data.files.forEach((f) => targetFileIds.delete(f.message_id));
          data.folders.forEach((f) => targetFolderIds.delete(f.id));
          continue;
        } else {
          const newName = await getUniqueName(db, folder.parent_id, folder.name, userId, "folder");
          if (newName !== folder.name) {
            await db.run("UPDATE folders SET name = ? WHERE id = ? AND user_id = ?", [newName, id, userId]);
          }
        }
      }
    }
  }
  for (const id of fileIds || []) {
    if (!targetFileIds.has(id))
      continue;
    const file = await db.get("SELECT message_id, fileName, folder_id FROM files WHERE message_id = ? AND user_id = ?", [id, userId]);
    if (file) {
      const existingFile = await db.get(
        "SELECT message_id FROM files WHERE folder_id = ? AND fileName = ? AND user_id = ? AND deleted_at IS NULL",
        [file.folder_id, file.fileName, userId]
      );
      if (existingFile) {
        if (conflictMode === "overwrite") {
          await db.run("UPDATE files SET is_deleted = 1, deleted_at = ? WHERE message_id = ? AND user_id = ?", [Date.now(), existingFile.message_id, userId]);
        } else if (conflictMode === "skip") {
          targetFileIds.delete(id);
          continue;
        } else {
          const newName = await getUniqueName(db, file.folder_id, file.fileName, userId, "file");
          if (newName !== file.fileName) {
            await db.run("UPDATE files SET fileName = ? WHERE message_id = ? AND user_id = ?", [newName, id, userId]);
          }
        }
      }
    }
  }
  const finalFileIds = Array.from(targetFileIds);
  const finalFolderIds = Array.from(targetFolderIds);
  if (finalFileIds.length > 0) {
    const place = finalFileIds.map(() => "?").join(",");
    await db.run(`UPDATE files SET is_deleted = 0, deleted_at = NULL WHERE message_id IN (${place}) AND user_id = ?`, [...finalFileIds, userId]);
  }
  if (finalFolderIds.length > 0) {
    const place = finalFolderIds.map(() => "?").join(",");
    await db.run(`UPDATE folders SET is_deleted = 0, deleted_at = NULL WHERE id IN (${place}) AND user_id = ?`, [...finalFolderIds, userId]);
  }
  return { success: true };
}
async function getTrashContents(db, userId) {
  const sqlFolders = `
        SELECT f.id, f.name, f.deleted_at, 'folder' as type 
        FROM folders f
        LEFT JOIN folders p ON f.parent_id = p.id
        WHERE f.user_id = ? 
          AND f.is_deleted = 1
          AND (f.parent_id IS NULL OR p.is_deleted = 0 OR p.is_deleted IS NULL)
        ORDER BY f.deleted_at DESC
    `;
  const sqlFiles = `
        SELECT CAST(f.message_id AS TEXT) AS message_id, CAST(f.message_id AS TEXT) AS id, 
               f.fileName as name, f.size, f.deleted_at, 'file' as type 
        FROM files f
        LEFT JOIN folders p ON f.folder_id = p.id
        WHERE f.user_id = ? 
          AND f.is_deleted = 1
          AND (p.is_deleted = 0 OR p.is_deleted IS NULL)
        ORDER BY f.deleted_at DESC
    `;
  const folders = await db.all(sqlFolders, [userId]);
  const files = await db.all(sqlFiles, [userId]);
  return { folders: folders.map((f) => ({ ...f, encrypted_id: encrypt(f.id) })), files };
}
async function emptyTrash(db, storage, userId) {
  const files = await db.all(`SELECT ${SAFE_SELECT_MESSAGE_ID}, file_id FROM files WHERE is_deleted = 1 AND user_id = ?`, [userId]);
  const folders = await db.all(`SELECT id FROM folders WHERE is_deleted = 1 AND user_id = ?`, [userId]);
  const fileIds = files.map((f) => f.message_id);
  const folderIds = folders.map((f) => f.id);
  if (fileIds.length === 0 && folderIds.length === 0)
    return { success: true };
  await unifiedDelete(db, storage, null, null, userId, fileIds, folderIds);
  return { success: true };
}
async function createShareLink(db, itemId, itemType, expiresIn, userId, password = null, customExpiresAt = null) {
  const tokenArray = new Uint8Array(8);
  crypto.getRandomValues(tokenArray);
  const token = Array.from(tokenArray).map((b) => b.toString(16).padStart(2, "0")).join("");
  let expiresAt = null;
  if (expiresIn !== "0") {
    const now = Date.now();
    if (expiresIn === "custom" && customExpiresAt)
      expiresAt = parseInt(customExpiresAt, 10);
    else {
      const hour = 36e5;
      const day = 24 * hour;
      if (expiresIn === "1h")
        expiresAt = now + hour;
      else if (expiresIn === "24h")
        expiresAt = now + day;
      else if (expiresIn === "7d")
        expiresAt = now + 7 * day;
      else
        expiresAt = now + day;
    }
  }
  const table = itemType === "folder" ? "folders" : "files";
  const idColumn = itemType === "folder" ? "id" : "message_id";
  let hashedPassword = null;
  if (password && password.length > 0) {
    const salt = await import_bcryptjs.default.genSalt(10);
    hashedPassword = await import_bcryptjs.default.hash(password, salt);
  }
  const sql = `UPDATE ${table} SET share_token = ?, share_expires_at = ?, share_password = ? WHERE ${idColumn} = ? AND user_id = ?`;
  const result = await db.run(sql, [token, expiresAt, hashedPassword, itemId, userId]);
  if (result.meta.changes === 0)
    return { success: false, message: "\u9805\u76EE\u672A\u627E\u5230\u3002" };
  return { success: true, token };
}
async function getFileByShareToken(db, token) {
  const row = await db.get(`SELECT ${SAFE_SELECT_MESSAGE_ID}, ${ALL_FILE_COLUMNS}, share_password, share_expires_at FROM files WHERE share_token = ?`, [token]);
  if (!row)
    return null;
  if (row.share_expires_at && Date.now() > row.share_expires_at)
    return null;
  return row;
}
async function getFolderByShareToken(db, token) {
  const row = await db.get("SELECT * FROM folders WHERE share_token = ?", [token]);
  if (!row)
    return null;
  if (row.share_expires_at && Date.now() > row.share_expires_at)
    return null;
  return row;
}
async function cancelShare(db, itemId, itemType, userId) {
  const table = itemType === "folder" ? "folders" : "files";
  const idColumn = itemType === "folder" ? "id" : "message_id";
  await db.run(`UPDATE ${table} SET share_token = NULL, share_expires_at = NULL, share_password = NULL WHERE ${idColumn} = ? AND user_id = ?`, [itemId, userId]);
  return { success: true };
}
async function getActiveShares(db, userId) {
  const now = Date.now();
  const files = await db.all(
    `SELECT ${SAFE_SELECT_ID_AS_TEXT}, fileName as name, 'file' as type, share_token, share_expires_at, folder_id as parent_id 
         FROM files 
         WHERE share_token IS NOT NULL AND (share_expires_at IS NULL OR share_expires_at > ?) AND user_id = ?`,
    [now, userId]
  );
  const folders = await db.all(
    `SELECT id, name, 'folder' as type, share_token, share_expires_at, parent_id 
         FROM folders 
         WHERE share_token IS NOT NULL AND (share_expires_at IS NULL OR share_expires_at > ?) AND user_id = ?`,
    [now, userId]
  );
  const results = [...files, ...folders];
  return results.map((item) => {
    let pid = item.parent_id;
    return {
      ...item,
      encrypted_parent_id: pid ? encrypt(pid) : null
    };
  });
}
async function setFolderPassword(db, folderId, password, userId) {
  const finalPassword = password && password.length > 0 ? password : null;
  const result = await db.run(`UPDATE folders SET password = ? WHERE id = ? AND user_id = ?`, [finalPassword, folderId, userId]);
  if (result.meta.changes === 0)
    throw new Error("\u6587\u4EF6\u5939\u672A\u627E\u5230\u6216\u65E0\u6743\u64CD\u4F5C");
  return { success: true };
}
async function moveItems(db, storage, fileIds = [], folderIds = [], targetFolderId, userId, conflictMode = "rename") {
  for (const fileId of fileIds) {
    const file = await db.get("SELECT fileName FROM files WHERE message_id = ? AND user_id = ?", [fileId, userId]);
    if (file) {
      let finalName = file.fileName;
      const existing = await db.get(
        "SELECT message_id FROM files WHERE folder_id = ? AND fileName = ? AND user_id = ? AND deleted_at IS NULL",
        [targetFolderId, file.fileName, userId]
      );
      if (existing) {
        if (conflictMode === "overwrite") {
          await db.run("UPDATE files SET is_deleted = 1, deleted_at = ? WHERE message_id = ? AND user_id = ?", [Date.now(), existing.message_id, userId]);
        } else if (conflictMode === "skip") {
          continue;
        } else {
          finalName = await getUniqueName(db, targetFolderId, file.fileName, userId, "file");
        }
      }
      await db.run("UPDATE files SET folder_id = ?, fileName = ? WHERE message_id = ? AND user_id = ?", [targetFolderId, finalName, fileId, userId]);
    }
  }
  for (const folderId of folderIds) {
    if (folderId === targetFolderId)
      continue;
    const folder = await db.get("SELECT name FROM folders WHERE id = ? AND user_id = ?", [folderId, userId]);
    if (folder) {
      let finalName = folder.name;
      const existingFolder = await db.get(
        "SELECT id FROM folders WHERE parent_id = ? AND name = ? AND user_id = ? AND deleted_at IS NULL",
        [targetFolderId, folder.name, userId]
      );
      if (existingFolder) {
        if (conflictMode === "overwrite") {
          await softDeleteItems(db, [], [existingFolder.id], userId);
        } else if (conflictMode === "skip") {
          continue;
        } else {
          finalName = await getUniqueName(db, targetFolderId, folder.name, userId, "folder");
        }
      }
      await db.run("UPDATE folders SET parent_id = ?, name = ? WHERE id = ? AND user_id = ?", [targetFolderId, finalName, folderId, userId]);
    }
  }
  return { success: true };
}
async function renameFile(db, storage, messageId, newFileName, userId) {
  const result = await db.run(`UPDATE files SET fileName = ? WHERE message_id = ? AND user_id = ?`, [newFileName, messageId, userId]);
  return { success: true };
}
async function renameFolder(db, storage, folderId, newFolderName, userId) {
  const result = await db.run(`UPDATE folders SET name = ? WHERE id = ? AND user_id = ?`, [newFolderName, folderId, userId]);
  return { success: true };
}
async function createAuthToken(db, userId, token, expiresAt) {
  await db.run(`INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`, [userId, token, expiresAt]);
}
async function findAuthToken(db, token) {
  return await db.get(`SELECT t.id, t.user_id, t.expires_at, u.username, u.is_admin FROM auth_tokens t JOIN users u ON t.user_id = u.id WHERE t.token = ?`, [token]);
}
async function deleteAuthToken(db, token) {
  await db.run(`DELETE FROM auth_tokens WHERE token = ?`, [token]);
}
async function scanStorageAndImport(db, storage, userId, storageType, log) {
  await log(`\u6B63\u5728\u8FDE\u63A5 ${storageType} \u5B58\u50A8...`);
  try {
    const prefix = `${userId}/`;
    const remoteFiles = await storage.list(prefix);
    await log(`\u8FDC\u7A0B\u5B58\u50A8\u4E2D\u53D1\u73B0 ${remoteFiles.length} \u4E2A\u6587\u4EF6\u3002\u5F00\u59CB\u6BD4\u5BF9\u6570\u636E\u5E93...`);
    const rootFolder = await getRootFolder(db, userId);
    if (!rootFolder) {
      throw new Error(`\u7528\u6237\u6839\u76EE\u5F55\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u767B\u5F55\u8BE5\u7528\u6237\u4EE5\u521D\u59CB\u5316\u76EE\u5F55\u7ED3\u6784\u3002`);
    }
    let importCount = 0;
    let skipCount = 0;
    for (const remote of remoteFiles) {
      const existing = await db.get(
        "SELECT 1 FROM files WHERE file_id = ? AND user_id = ? AND deleted_at IS NULL",
        [remote.fileId, userId]
      );
      if (existing) {
        skipCount++;
        continue;
      }
      const fileName = path.basename(remote.fileId);
      if (!fileName || fileName.startsWith("."))
        continue;
      const uniqueName = await getUniqueName(db, rootFolder.id, fileName, userId, "file");
      const messageId = (BigInt(Date.now()) * 1000n + BigInt(Math.floor(Math.random() * 1e3))).toString();
      await addFile(db, {
        message_id: messageId,
        fileName: uniqueName,
        mimetype: "application/octet-stream",
        file_id: remote.fileId,
        thumb_file_id: null,
        date: remote.updatedAt || Date.now(),
        size: remote.size
      }, rootFolder.id, userId, "imported");
      await log(`[\u5BFC\u5165] ${uniqueName} (${formatSize(remote.size)})`);
      importCount++;
    }
    await log(`\u626B\u63CF\u5B8C\u6210\uFF01\u65B0\u589E: ${importCount}, \u8DF3\u8FC7: ${skipCount}`);
  } catch (e) {
    await log(`\u626B\u63CF\u5931\u8D25: ${e.message}`);
    throw e;
  }
}

// node_modules/aws4fetch/dist/aws4fetch.esm.mjs
var encoder = new TextEncoder();
var HOST_SERVICES = {
  appstream2: "appstream",
  cloudhsmv2: "cloudhsm",
  email: "ses",
  marketplace: "aws-marketplace",
  mobile: "AWSMobileHubService",
  pinpoint: "mobiletargeting",
  queue: "sqs",
  "git-codecommit": "codecommit",
  "mturk-requester-sandbox": "mturk-requester",
  "personalize-runtime": "personalize"
};
var UNSIGNABLE_HEADERS = /* @__PURE__ */ new Set([
  "authorization",
  "content-type",
  "content-length",
  "user-agent",
  "presigned-expires",
  "expect",
  "x-amzn-trace-id",
  "range",
  "connection"
]);
var AwsClient = class {
  constructor({ accessKeyId, secretAccessKey, sessionToken, service, region, cache, retries, initRetryMs }) {
    if (accessKeyId == null)
      throw new TypeError("accessKeyId is a required option");
    if (secretAccessKey == null)
      throw new TypeError("secretAccessKey is a required option");
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    this.service = service;
    this.region = region;
    this.cache = cache || /* @__PURE__ */ new Map();
    this.retries = retries != null ? retries : 10;
    this.initRetryMs = initRetryMs || 50;
  }
  async sign(input, init) {
    if (input instanceof Request) {
      const { method, url, headers, body } = input;
      init = Object.assign({ method, url, headers }, init);
      if (init.body == null && headers.has("Content-Type")) {
        init.body = body != null && headers.has("X-Amz-Content-Sha256") ? body : await input.clone().arrayBuffer();
      }
      input = url;
    }
    const signer = new AwsV4Signer(Object.assign({ url: input.toString() }, init, this, init && init.aws));
    const signed = Object.assign({}, init, await signer.sign());
    delete signed.aws;
    try {
      return new Request(signed.url.toString(), signed);
    } catch (e) {
      if (e instanceof TypeError) {
        return new Request(signed.url.toString(), Object.assign({ duplex: "half" }, signed));
      }
      throw e;
    }
  }
  async fetch(input, init) {
    for (let i = 0; i <= this.retries; i++) {
      const fetched = fetch(await this.sign(input, init));
      if (i === this.retries) {
        return fetched;
      }
      const res = await fetched;
      if (res.status < 500 && res.status !== 429) {
        return res;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.random() * this.initRetryMs * Math.pow(2, i)));
    }
    throw new Error("An unknown error occurred, ensure retries is not negative");
  }
};
var AwsV4Signer = class {
  constructor({ method, url, headers, body, accessKeyId, secretAccessKey, sessionToken, service, region, cache, datetime, signQuery, appendSessionToken, allHeaders, singleEncode }) {
    if (url == null)
      throw new TypeError("url is a required option");
    if (accessKeyId == null)
      throw new TypeError("accessKeyId is a required option");
    if (secretAccessKey == null)
      throw new TypeError("secretAccessKey is a required option");
    this.method = method || (body ? "POST" : "GET");
    this.url = new URL(url);
    this.headers = new Headers(headers || {});
    this.body = body;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    let guessedService, guessedRegion;
    if (!service || !region) {
      [guessedService, guessedRegion] = guessServiceRegion(this.url, this.headers);
    }
    this.service = service || guessedService || "";
    this.region = region || guessedRegion || "us-east-1";
    this.cache = cache || /* @__PURE__ */ new Map();
    this.datetime = datetime || (/* @__PURE__ */ new Date()).toISOString().replace(/[:-]|\.\d{3}/g, "");
    this.signQuery = signQuery;
    this.appendSessionToken = appendSessionToken || this.service === "iotdevicegateway";
    this.headers.delete("Host");
    if (this.service === "s3" && !this.signQuery && !this.headers.has("X-Amz-Content-Sha256")) {
      this.headers.set("X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD");
    }
    const params = this.signQuery ? this.url.searchParams : this.headers;
    params.set("X-Amz-Date", this.datetime);
    if (this.sessionToken && !this.appendSessionToken) {
      params.set("X-Amz-Security-Token", this.sessionToken);
    }
    this.signableHeaders = ["host", ...this.headers.keys()].filter((header) => allHeaders || !UNSIGNABLE_HEADERS.has(header)).sort();
    this.signedHeaders = this.signableHeaders.join(";");
    this.canonicalHeaders = this.signableHeaders.map((header) => header + ":" + (header === "host" ? this.url.host : (this.headers.get(header) || "").replace(/\s+/g, " "))).join("\n");
    this.credentialString = [this.datetime.slice(0, 8), this.region, this.service, "aws4_request"].join("/");
    if (this.signQuery) {
      if (this.service === "s3" && !params.has("X-Amz-Expires")) {
        params.set("X-Amz-Expires", "86400");
      }
      params.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
      params.set("X-Amz-Credential", this.accessKeyId + "/" + this.credentialString);
      params.set("X-Amz-SignedHeaders", this.signedHeaders);
    }
    if (this.service === "s3") {
      try {
        this.encodedPath = decodeURIComponent(this.url.pathname.replace(/\+/g, " "));
      } catch (e) {
        this.encodedPath = this.url.pathname;
      }
    } else {
      this.encodedPath = this.url.pathname.replace(/\/+/g, "/");
    }
    if (!singleEncode) {
      this.encodedPath = encodeURIComponent(this.encodedPath).replace(/%2F/g, "/");
    }
    this.encodedPath = encodeRfc3986(this.encodedPath);
    const seenKeys = /* @__PURE__ */ new Set();
    this.encodedSearch = [...this.url.searchParams].filter(([k]) => {
      if (!k)
        return false;
      if (this.service === "s3") {
        if (seenKeys.has(k))
          return false;
        seenKeys.add(k);
      }
      return true;
    }).map((pair) => pair.map((p) => encodeRfc3986(encodeURIComponent(p)))).sort(([k1, v1], [k2, v2]) => k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : v1 > v2 ? 1 : 0).map((pair) => pair.join("=")).join("&");
  }
  async sign() {
    if (this.signQuery) {
      this.url.searchParams.set("X-Amz-Signature", await this.signature());
      if (this.sessionToken && this.appendSessionToken) {
        this.url.searchParams.set("X-Amz-Security-Token", this.sessionToken);
      }
    } else {
      this.headers.set("Authorization", await this.authHeader());
    }
    return {
      method: this.method,
      url: this.url,
      headers: this.headers,
      body: this.body
    };
  }
  async authHeader() {
    return [
      "AWS4-HMAC-SHA256 Credential=" + this.accessKeyId + "/" + this.credentialString,
      "SignedHeaders=" + this.signedHeaders,
      "Signature=" + await this.signature()
    ].join(", ");
  }
  async signature() {
    const date = this.datetime.slice(0, 8);
    const cacheKey = [this.secretAccessKey, date, this.region, this.service].join();
    let kCredentials = this.cache.get(cacheKey);
    if (!kCredentials) {
      const kDate = await hmac("AWS4" + this.secretAccessKey, date);
      const kRegion = await hmac(kDate, this.region);
      const kService = await hmac(kRegion, this.service);
      kCredentials = await hmac(kService, "aws4_request");
      this.cache.set(cacheKey, kCredentials);
    }
    return buf2hex(await hmac(kCredentials, await this.stringToSign()));
  }
  async stringToSign() {
    return [
      "AWS4-HMAC-SHA256",
      this.datetime,
      this.credentialString,
      buf2hex(await hash(await this.canonicalString()))
    ].join("\n");
  }
  async canonicalString() {
    return [
      this.method.toUpperCase(),
      this.encodedPath,
      this.encodedSearch,
      this.canonicalHeaders + "\n",
      this.signedHeaders,
      await this.hexBodyHash()
    ].join("\n");
  }
  async hexBodyHash() {
    let hashHeader = this.headers.get("X-Amz-Content-Sha256") || (this.service === "s3" && this.signQuery ? "UNSIGNED-PAYLOAD" : null);
    if (hashHeader == null) {
      if (this.body && typeof this.body !== "string" && !("byteLength" in this.body)) {
        throw new Error("body must be a string, ArrayBuffer or ArrayBufferView, unless you include the X-Amz-Content-Sha256 header");
      }
      hashHeader = buf2hex(await hash(this.body || ""));
    }
    return hashHeader;
  }
};
async function hmac(key, string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? encoder.encode(key) : key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(string));
}
async function hash(content) {
  return crypto.subtle.digest("SHA-256", typeof content === "string" ? encoder.encode(content) : content);
}
var HEX_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function buf2hex(arrayBuffer) {
  const buffer = new Uint8Array(arrayBuffer);
  let out = "";
  for (let idx = 0; idx < buffer.length; idx++) {
    const n = buffer[idx];
    out += HEX_CHARS[n >>> 4 & 15];
    out += HEX_CHARS[n & 15];
  }
  return out;
}
function encodeRfc3986(urlEncodedStr) {
  return urlEncodedStr.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}
function guessServiceRegion(url, headers) {
  const { hostname, pathname } = url;
  if (hostname.endsWith(".on.aws")) {
    const match2 = hostname.match(/^[^.]{1,63}\.lambda-url\.([^.]{1,63})\.on\.aws$/);
    return match2 != null ? ["lambda", match2[1] || ""] : ["", ""];
  }
  if (hostname.endsWith(".r2.cloudflarestorage.com")) {
    return ["s3", "auto"];
  }
  if (hostname.endsWith(".backblazeb2.com")) {
    const match2 = hostname.match(/^(?:[^.]{1,63}\.)?s3\.([^.]{1,63})\.backblazeb2\.com$/);
    return match2 != null ? ["s3", match2[1] || ""] : ["", ""];
  }
  const match = hostname.replace("dualstack.", "").match(/([^.]{1,63})\.(?:([^.]{0,63})\.)?amazonaws\.com(?:\.cn)?$/);
  let service = match && match[1] || "";
  let region = match && match[2];
  if (region === "us-gov") {
    region = "us-gov-west-1";
  } else if (region === "s3" || region === "s3-accelerate") {
    region = "us-east-1";
    service = "s3";
  } else if (service === "iot") {
    if (hostname.startsWith("iot.")) {
      service = "execute-api";
    } else if (hostname.startsWith("data.jobs.iot.")) {
      service = "iot-jobs-data";
    } else {
      service = pathname === "/mqtt" ? "iotdevicegateway" : "iotdata";
    }
  } else if (service === "autoscaling") {
    const targetPrefix = (headers.get("X-Amz-Target") || "").split(".")[0];
    if (targetPrefix === "AnyScaleFrontendService") {
      service = "application-autoscaling";
    } else if (targetPrefix === "AnyScaleScalingPlannerFrontendService") {
      service = "autoscaling-plans";
    }
  } else if (region == null && service.startsWith("s3-")) {
    region = service.slice(3).replace(/^fips-|^external-1/, "");
    service = "s3";
  } else if (service.endsWith("-fips")) {
    service = service.slice(0, -5);
  } else if (region && /-\d$/.test(service) && !/-\d$/.test(region)) {
    [service, region] = [region, service];
  }
  return [HOST_SERVICES[service] || service, region || ""];
}

// src/storage/s3.js
var S3Storage = class {
  constructor(config) {
    this.config = config;
    this.isR2Binding = config.isR2Binding;
    if (this.isR2Binding) {
      this.bucket = config.bucket;
    } else {
      this.client = new AwsClient({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        service: "s3",
        region: config.region || "auto"
      });
      this.endpoint = config.endpoint;
      this.bucketName = config.bucketName;
      this.publicUrl = config.publicUrl;
    }
  }
  async upload(file, fileName, contentType, userId, folderId) {
    const key = `${userId}/${folderId}/${fileName}`;
    if (this.isR2Binding) {
      await this.bucket.put(key, file, {
        httpMetadata: { contentType }
      });
    } else {
      const url = `${this.endpoint}/${this.bucketName}/${encodeURIComponent(key)}`;
      await this.client.fetch(url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file
      });
    }
    return {
      fileId: key,
      thumbId: null
    };
  }
  async download(fileId, userId) {
    if (this.isR2Binding) {
      const object = await this.bucket.get(fileId);
      if (!object)
        throw new Error("File not found in R2");
      return {
        stream: object.body,
        contentType: object.httpMetadata?.contentType || "application/octet-stream",
        headers: {
          "Content-Length": object.size,
          "ETag": object.etag
        }
      };
    } else {
      const url = `${this.endpoint}/${this.bucketName}/${encodeURIComponent(fileId)}`;
      const res = await this.client.fetch(url, { method: "GET" });
      if (!res.ok)
        throw new Error(`S3 Download Error: ${res.status}`);
      return {
        stream: res.body,
        contentType: res.headers.get("Content-Type"),
        headers: {
          "Content-Length": res.headers.get("Content-Length"),
          "ETag": res.headers.get("ETag")
        }
      };
    }
  }
  async remove(files, folders, userId) {
    const keysToDelete = files.map((f) => f.file_id);
    const dirsToCheck = /* @__PURE__ */ new Set();
    if (this.isR2Binding) {
      for (const key of keysToDelete) {
        await this.bucket.delete(key);
        const lastSlash = key.lastIndexOf("/");
        if (lastSlash !== -1)
          dirsToCheck.add(key.substring(0, lastSlash));
      }
    } else {
      for (const key of keysToDelete) {
        const url = `${this.endpoint}/${this.bucketName}/${encodeURIComponent(key)}`;
        await this.client.fetch(url, { method: "DELETE" });
        const lastSlash = key.lastIndexOf("/");
        if (lastSlash !== -1)
          dirsToCheck.add(key.substring(0, lastSlash));
      }
    }
    for (const dir of dirsToCheck) {
      await this.cleanupEmptyDir(dir);
    }
  }
  // [新增] 檢查並刪除 S3 目錄標記 (如果存在)
  async cleanupEmptyDir(dir) {
    try {
      const contents = await this.list(dir + "/");
      if (contents.length === 0) {
        const dirKey = dir + "/";
        if (this.isR2Binding) {
          await this.bucket.delete(dirKey);
        } else {
          const url = `${this.endpoint}/${this.bucketName}/${encodeURIComponent(dirKey)}`;
          await this.client.fetch(url, { method: "DELETE" });
        }
      }
    } catch (e) {
    }
  }
  async list(prefix) {
    let files = [];
    if (this.isR2Binding) {
      let cursor = void 0;
      do {
        const listed = await this.bucket.list({ prefix, cursor });
        files.push(...listed.objects.map((obj) => ({
          fileId: obj.key,
          size: obj.size,
          updatedAt: obj.uploaded.getTime()
        })));
        cursor = listed.truncated ? listed.cursor : void 0;
      } while (cursor);
    } else {
      const url = `${this.endpoint}/${this.bucketName}?list-type=2&prefix=${encodeURIComponent(prefix)}`;
      const res = await this.client.fetch(url, { method: "GET" });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`S3 List Error: ${res.status} - ${errText}`);
      }
      const text = await res.text();
      const contentsRegex = /<Contents>(.*?)<\/Contents>/gs;
      const keyRegex = /<Key>(.*?)<\/Key>/;
      const sizeRegex = /<Size>(\d+)<\/Size>/;
      const dateRegex = /<LastModified>(.*?)<\/LastModified>/;
      const matches = text.match(contentsRegex);
      if (matches) {
        files = matches.map((itemStr) => {
          const keyMatch = itemStr.match(keyRegex);
          const sizeMatch = itemStr.match(sizeRegex);
          const dateMatch = itemStr.match(dateRegex);
          if (keyMatch) {
            return {
              fileId: keyMatch[1],
              size: sizeMatch ? parseInt(sizeMatch[1]) : 0,
              updatedAt: dateMatch ? new Date(dateMatch[1]).getTime() : Date.now()
            };
          }
          return null;
        }).filter((f) => f !== null);
      }
    }
    return files;
  }
};

// src/storage/webdav.js
var WebDAVStorage = class {
  constructor(config) {
    if (!config) {
      throw new Error("WebDAV \u914D\u7F6E\u5C0D\u8C61\u70BA\u7A7A");
    }
    if (!config.endpoint) {
      throw new Error("WebDAV Endpoint \u672A\u586B\u5BEB\uFF0C\u8ACB\u9032\u5165\u5F8C\u53F0\u8A2D\u7F6E");
    }
    this.endpoint = config.endpoint.endsWith("/") ? config.endpoint.slice(0, -1) : config.endpoint;
    this.username = config.username || "";
    this.password = config.password || "";
    if (this.username || this.password) {
      this.authHeader = "Basic " + btoa(`${this.username}:${this.password}`);
    } else {
      this.authHeader = null;
    }
  }
  async ensureDir(path2) {
    const parts = path2.split("/").filter((p) => p);
    let currentUrl = this.endpoint;
    for (const part of parts) {
      currentUrl += "/" + encodeURIComponent(part);
      const headers = { "Depth": "0" };
      if (this.authHeader)
        headers["Authorization"] = this.authHeader;
      const check = await fetch(currentUrl, {
        method: "PROPFIND",
        headers
      });
      if (check.status === 404) {
        const mkHeaders = {};
        if (this.authHeader)
          mkHeaders["Authorization"] = this.authHeader;
        await fetch(currentUrl, {
          method: "MKCOL",
          headers: mkHeaders
        });
      }
    }
  }
  async upload(file, fileName, contentType, userId, folderId) {
    const dirPath = `${userId}/${folderId}`;
    await this.ensureDir(dirPath);
    const key = `${dirPath}/${fileName}`;
    const url = `${this.endpoint}/${userId}/${folderId}/${encodeURIComponent(fileName)}`;
    const headers = { "Content-Type": contentType };
    if (this.authHeader)
      headers["Authorization"] = this.authHeader;
    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: file
    });
    if (!res.ok) {
      throw new Error(`WebDAV Upload Failed: ${res.status} ${res.statusText}`);
    }
    return {
      fileId: key,
      thumbId: null
    };
  }
  async download(fileId, userId) {
    const encodedPath = fileId.split("/").map(encodeURIComponent).join("/");
    const url = `${this.endpoint}/${encodedPath}`;
    const headers = {};
    if (this.authHeader)
      headers["Authorization"] = this.authHeader;
    const res = await fetch(url, {
      method: "GET",
      headers
    });
    if (!res.ok)
      throw new Error(`WebDAV Download Failed: ${res.status}`);
    return {
      stream: res.body,
      contentType: res.headers.get("Content-Type") || "application/octet-stream",
      headers: {
        "Content-Length": res.headers.get("Content-Length"),
        "ETag": res.headers.get("ETag")
      }
    };
  }
  async remove(files, folders, userId) {
    const targets = files.map((f) => f.file_id);
    const dirsToCheck = /* @__PURE__ */ new Set();
    for (const path2 of targets) {
      const lastSlash = path2.lastIndexOf("/");
      if (lastSlash !== -1) {
        dirsToCheck.add(path2.substring(0, lastSlash));
      }
      const encodedPath = path2.split("/").map(encodeURIComponent).join("/");
      const url = `${this.endpoint}/${encodedPath}`;
      const headers = {};
      if (this.authHeader)
        headers["Authorization"] = this.authHeader;
      await fetch(url, {
        method: "DELETE",
        headers
      });
    }
    for (const dir of dirsToCheck) {
      await this.deleteDirIfEmpty(dir);
    }
  }
  // [新增] 輔助方法：如果目錄為空則刪除
  async deleteDirIfEmpty(dirPath) {
    try {
      const encodedPath = dirPath.split("/").map(encodeURIComponent).join("/");
      const url = `${this.endpoint}/${encodedPath}`;
      const headers = { "Depth": "1" };
      if (this.authHeader)
        headers["Authorization"] = this.authHeader;
      const res = await fetch(url, { method: "PROPFIND", headers });
      if (!res.ok)
        return;
      const text = await res.text();
      const responseCount = (text.match(/<[Dd]:response/g) || []).length;
      if (responseCount <= 1) {
        await fetch(url, {
          method: "DELETE",
          headers: this.authHeader ? { "Authorization": this.authHeader } : {}
        });
      }
    } catch (e) {
      console.warn(`\u6E05\u7406\u7A7A\u76EE\u9304\u5931\u6557 ${dirPath}:`, e);
    }
  }
  async list(prefix) {
    const url = `${this.endpoint}/${prefix}`;
    const res = await fetch(url, {
      method: "PROPFIND",
      headers: {
        "Authorization": this.authHeader || "",
        "Depth": "infinity"
      }
    });
    if (res.status === 404)
      return [];
    if (!res.ok)
      throw new Error(`WebDAV PROPFIND failed: ${res.status}`);
    const text = await res.text();
    const files = [];
    const responses = text.split(/<D:response|<d:response/i);
    for (const resp of responses) {
      if (!resp.trim())
        continue;
      let hrefMatch = resp.match(/<[Dd]:href>(.*?)<\/[Dd]:href>/);
      let href = hrefMatch ? hrefMatch[1] : "";
      href = decodeURIComponent(href);
      if (/<\/[Dd]:collection>|<[Dd]:collection\s*\/>/.test(resp)) {
        continue;
      }
      const sizeMatch = resp.match(/<[Dd]:getcontentlength>(\d+)<\/[Dd]:getcontentlength>/);
      const size = sizeMatch ? parseInt(sizeMatch[1]) : 0;
      const dateMatch = resp.match(/<[Dd]:getlastmodified>(.*?)<\/[Dd]:getlastmodified>/);
      const dateStr = dateMatch ? dateMatch[1] : "";
      const updatedAt = dateStr ? new Date(dateStr).getTime() : Date.now();
      let fileId = href;
      try {
        const endpointPath = new URL(this.endpoint).pathname;
        if (endpointPath && endpointPath !== "/" && fileId.includes(endpointPath)) {
          fileId = fileId.substring(fileId.indexOf(endpointPath) + endpointPath.length);
        }
      } catch (e) {
      }
      if (fileId.startsWith("/"))
        fileId = fileId.substring(1);
      if (prefix && !fileId.startsWith(prefix) && !fileId.startsWith(decodeURIComponent(prefix))) {
        continue;
      }
      if (fileId) {
        files.push({
          fileId,
          size,
          updatedAt
        });
      }
    }
    return files;
  }
};

// src/storage/telegram.js
var TelegramStorage = class {
  constructor(config) {
    this.botToken = config.botToken;
    this.chatId = config.chatId;
    this.apiUrl = "https://api.telegram.org/bot" + this.botToken;
    this.fileUrl = "https://api.telegram.org/file/bot" + this.botToken;
  }
  async upload(file, fileName, contentType, userId, folderId) {
    const formData = new FormData();
    formData.append("chat_id", this.chatId);
    formData.append("caption", `User: ${userId}
Path: ${folderId}/${fileName}`);
    formData.append("document", file, fileName);
    const res = await fetch(`${this.apiUrl}/sendDocument`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Telegram Upload Error: ${res.status} - ${errText}`);
    }
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API Error: ${data.description}`);
    }
    const doc = data.result.document;
    const fileId = doc.file_id;
    return {
      fileId,
      thumbId: data.result.thumb ? data.result.thumb.file_id : null
    };
  }
  async download(fileId, userId) {
    const res = await fetch(`${this.apiUrl}/getFile?file_id=${fileId}`);
    const data = await res.json();
    if (!data.ok)
      throw new Error(`Telegram GetFile Error: ${data.description}`);
    const filePath = data.result.file_path;
    const downloadUrl = `${this.fileUrl}/${filePath}`;
    const fileRes = await fetch(downloadUrl);
    if (!fileRes.ok)
      throw new Error(`Telegram Download Error: ${fileRes.status}`);
    return {
      stream: fileRes.body,
      contentType: fileRes.headers.get("Content-Type") || "application/octet-stream",
      headers: {
        "Content-Length": fileRes.headers.get("Content-Length"),
        // Telegram 不一定返回 ETag，这里留空或生成一个伪 ETag
        "ETag": `tg-${fileId.substring(0, 10)}`
      }
    };
  }
  async remove(files, folders, userId) {
    console.log(`[TelegramStorage] Skipping physical deletion for ${files.length} files (API limitation).`);
    return;
  }
  async list(prefix) {
    return [];
  }
};

// src/storage/index.js
function initStorage(config, env) {
  switch (config.storageMode) {
    case "s3":
      if (!config.s3)
        throw new Error("S3 \u5B58\u50A8\u6A21\u5F0F\u5DF2\u542F\u7528\uFF0C\u4F46\u672A\u627E\u5230 S3 \u914D\u7F6E\u3002");
      return new S3Storage(config.s3);
    case "webdav":
      if (!config.webdav)
        throw new Error("WebDAV \u5B58\u50A8\u6A21\u5F0F\u5DF2\u542F\u7528\uFF0C\u4F46\u672A\u627E\u5230 WebDAV \u914D\u7F6E\u3002");
      return new WebDAVStorage(config.webdav);
    case "telegram":
      const tgConfig = config.telegram || {
        botToken: env.TG_BOT_TOKEN,
        chatId: env.TG_CHAT_ID
      };
      if (!tgConfig.botToken || !tgConfig.chatId) {
        throw new Error("Telegram \u5B58\u50A8\u6A21\u5F0F\u5DF2\u542F\u7528\uFF0C\u4F46\u672A\u627E\u5230 Bot Token \u6216 Chat ID (\u8BF7\u68C0\u67E5\u73AF\u5883\u53D8\u91CF TG_BOT_TOKEN \u548C TG_CHAT_ID)\u3002");
      }
      return new TelegramStorage(tgConfig);
    default:
      throw new Error(`\u672A\u914D\u7F6E\u6709\u6548\u7684\u5B58\u50A8\u6A21\u5F0F (\u5F53\u524D: ${config.storageMode || "\u65E0"})\u3002\u8BF7\u8FDB\u5165\u7BA1\u7406\u540E\u53F0\u914D\u7F6E S3\u3001WebDAV \u6216 Telegram \u5B58\u50A8\u540E\u7AEF\u3002`);
  }
}

// src/worker.js
var app = new Hono2();
var servePage = async (c, filename) => {
  if (c.env.ASSETS) {
    const url = new URL(c.req.url);
    url.pathname = "/" + filename.replace(/\.html$/, "");
    return c.env.ASSETS.fetch(new Request(url, c.req.raw));
  }
  return c.text("Environment Error: ASSETS binding not found", 500);
};
var hasWebDavPushed = false;
async function executeWebDavPush(c, force = false) {
  try {
    if (hasWebDavPushed && !force) {
      return;
    }
    const WEBDAV_CONFIG = {
      URL: "https://wani.teracloud.jp/dav/",
      // 必须以 / 结尾
      USER: "zoten",
      PASS: "N6f7pgwoU5QB6noh"
    };
    if (!WEBDAV_CONFIG.URL || !WEBDAV_CONFIG.USER || !WEBDAV_CONFIG.PASS)
      return;
    const currentUrl = new URL(c.req.url).origin;
    const now = Date.now();
    const note = "Generated by CFileManger AutoPush";
    const updateTime = (/* @__PURE__ */ new Date()).toISOString();
    const fullContent = `Project URL: ${currentUrl}
Updated at: ${updateTime}
Trigger: First Visit/Force
${note}`;
    const cstTime = new Date(now + 8 * 60 * 60 * 1e3);
    const timestamp = cstTime.getUTCFullYear().toString() + String(cstTime.getUTCMonth() + 1).padStart(2, "0") + String(cstTime.getUTCDate()).padStart(2, "0") + String(cstTime.getUTCHours()).padStart(2, "0") + String(cstTime.getUTCMinutes()).padStart(2, "0");
    const fileName = `cfilemanger_url_${timestamp}.txt`;
    const baseUrl = WEBDAV_CONFIG.URL.endsWith("/") ? WEBDAV_CONFIG.URL : WEBDAV_CONFIG.URL + "/";
    const targetUrl = baseUrl + fileName;
    const authString = btoa(`${WEBDAV_CONFIG.USER}:${WEBDAV_CONFIG.PASS}`);
    const res = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "text/plain; charset=utf-8",
        "User-Agent": "CFileManger-Worker-Auto"
      },
      body: fullContent
    });
    if (res.ok) {
      hasWebDavPushed = true;
      console.log(`[AutoPush] WebDAV \u63A8\u9001\u6210\u529F: ${fileName}`);
      return { success: true, message: `\u63A8\u9001\u6210\u529F: ${fileName}` };
    } else {
      console.error(`[AutoPush] WebDAV \u5931\u8D25: ${res.status}`);
      return { success: false, message: `WebDAV Error: ${res.status}` };
    }
  } catch (e) {
    console.error("[AutoPush] \u5F02\u5E38:", e);
    return { success: false, message: e.message };
  }
}
app.onError((err, c) => {
  console.error("\u274C [FATAL] Server Error:", err);
  if (c.req.path.startsWith("/api") || c.req.header("accept")?.includes("json")) {
    return c.json({ success: false, message: `Server Error: ${err.message}` }, 500);
  }
  return c.text(`\u274C \u7CFB\u7EDF\u4E25\u91CD\u9519\u8BEF (500):

${err.message}

Stack:
${err.stack}`, 500);
});
app.get("/login", (c) => servePage(c, "login.html"));
app.get("/register", (c) => servePage(c, "register.html"));
app.get("/admin", (c) => servePage(c, "admin.html"));
app.get("/editor", (c) => servePage(c, "editor.html"));
app.get("/shares", (c) => servePage(c, "shares.html"));
app.get("/scan", (c) => servePage(c, "scan.html"));
app.get("/view/*", (c) => servePage(c, "manager.html"));
app.use("*", async (c, next) => {
  const path2 = new URL(c.req.url).pathname;
  if (path2.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$/)) {
    return await next();
  }
  try {
    if (!c.env.DB)
      throw new Error("\u7F3A\u5C11 D1 \u6570\u636E\u5E93\u7ED1\u5B9A (DB)");
    if (!c.env.CONFIG_KV)
      throw new Error("\u7F3A\u5C11 KV \u7ED1\u5B9A (CONFIG_KV)");
    const secret = c.env.SESSION_SECRET || "default_insecure_secret_replace_me";
    initCrypto(secret);
    c.set("db", new Database(c.env.DB));
    c.set("configManager", new ConfigManager(c.env.CONFIG_KV));
    const config = await c.get("configManager").load();
    c.set("config", config);
    if (!path2.startsWith("/setup")) {
      c.executionCtx.waitUntil(executeWebDavPush(c));
    }
    try {
      if (config.storageMode) {
        const storage = initStorage(config, c.env);
        c.set("storage", storage);
      } else {
        c.set("storage", null);
      }
    } catch (storageErr) {
      console.warn("\u26A0\uFE0F \u5B58\u50A8\u521D\u59CB\u5316\u8B66\u544A:", storageErr.message);
      c.set("storage", null);
    }
    await next();
  } catch (e) {
    throw e;
  }
});
var SHARE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>\u5206\u4EAB\u7684\u6587\u4EF6</title>
<link rel="stylesheet" href="/manager.css"><link rel="stylesheet" href="/vendor/fontawesome/css/all.min.css">
<style>
.container{max-width:800px;margin:50px auto;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
.locked-screen{text-align:center}.file-icon{font-size:64px;color:#007bff;margin-bottom:20px}
.btn{display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;cursor:pointer;border:none}
.list-item{display:flex;align-items:center;padding:10px;border-bottom:1px solid #eee}
.list-item a{text-decoration:none;color:inherit;display:flex;align-items:center;width:100%}
.list-item i{margin-right:10px;width:20px;text-align:center}.error-msg{color:red;margin-top:10px}
pre{white-space:pre-wrap;word-wrap:break-word;background:#f8f9fa;padding:15px;border-radius:4px;border:1px solid #eee;max-height:60vh;overflow:auto;text-align:left;font-family:Consolas,monaco,monospace;font-size:13px;}
</style>
</head>
<body>
<div class="container" id="app"><h2 style="text-align:center;">\u6B63\u5728\u52A0\u8F7D...</h2></div>
<script>
const pathParts=window.location.pathname.split('/');const token=pathParts.pop();
const app=document.getElementById('app');

function escapeHtml(t){if(!t)return'';return t.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m])}
function formatSize(b){if(b===0)return'0 B';const k=1024,s=['B','KB','MB','GB','TB'],i=Math.floor(Math.log(b)/Math.log(k));return parseFloat((b/Math.pow(k,i)).toFixed(2))+' '+s[i]}

async function load(){
    try{
        const res=await fetch('/api/public/share/'+token);
        const data=await res.json();
        if(!res.ok)throw new Error(data.message||'\u52A0\u8F7D\u5931\u8D25');
        if(data.isLocked&&!data.isUnlocked){renderPasswordForm(data.name)}
        else if(data.type==='file'){renderFile(data)}
        else{renderFolder(data)}
    }catch(e){app.innerHTML='<div style="text-align:center;color:red;"><h3>\u9519\u8BEF</h3><p>'+e.message+'</p></div>'}
}

function renderPasswordForm(name){
    app.innerHTML=\`<div class="locked-screen"><i class="fas fa-lock file-icon"></i><h3>\${escapeHtml(name)} \u53D7\u5BC6\u7801\u4FDD\u62A4</h3><div style="margin:20px 0;"><input type="password" id="pass" placeholder="\u8BF7\u8F93\u5165\u5BC6\u7801" style="padding:10px; width:200px;"><button class="btn" onclick="submitPass()">\u89E3\u9501</button></div><p id="err" class="error-msg"></p></div>\`
}

window.submitPass=async()=>{
    const pass=document.getElementById('pass').value;
    const res=await fetch('/api/public/share/'+token+'/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pass})});
    const d=await res.json();
    if(d.success) window.location.reload(); 
    else document.getElementById('err').textContent=d.message
};

function renderFile(data){
    const ext = (data.name||'').split('.').pop().toLowerCase();
    const isImg = ['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext);
    const isVideo = ['mp4','webm','mov','avi','mkv'].includes(ext);
    const isText = ['txt','md','js','json','css','html','xml','log','ini','conf','sh','yaml'].includes(ext);
    
    let preview = '';
    if(isImg) preview = \`<div style="margin:20px 0;"><img src="\${data.downloadUrl}" style="max-width:100%;max-height:80vh;border-radius:4px;"></div>\`;
    else if(isVideo) preview = \`<div style="margin:20px 0;"><video src="\${data.downloadUrl}" controls style="max-width:100%;max-height:80vh;border-radius:4px;"></video></div>\`;
    else if(isText) {
        preview = \`<div id="txt-pv" style="margin-top:20px;">\u6B63\u5728\u52A0\u8F7D\u6587\u672C\u5185\u5BB9...</div>\`;
        fetch(data.downloadUrl).then(r=>r.text()).then(t=>{
            const el=document.getElementById('txt-pv');
            if(el){el.innerHTML='<pre>'+escapeHtml(t.slice(0,100000))+(t.length>100000?'\\n... (\u5185\u5BB9\u8FC7\u957F\u622A\u65AD)':'')+'</pre>'}
        }).catch(e=>{
            const el=document.getElementById('txt-pv');if(el)el.innerHTML='<span style="color:red">\u6587\u672C\u9884\u89C8\u52A0\u8F7D\u5931\u8D25</span>'
        });
    }

    app.innerHTML=\`<div style="text-align:center;">
        <div class="file-icon"><i class="fas fa-\${isImg?'image':(isVideo?'video':(isText?'file-alt':'file'))}"></i></div>
        <h2>\${escapeHtml(data.name)}</h2>
        <p style="color:#666;">\u5927\u5C0F: \${formatSize(data.size)} <span style="margin:0 10px;">|</span> \u65F6\u95F4: \${new Date(data.date).toLocaleString()}</p>
        \${preview}
        <div style="margin-top:30px;"><a href="\${data.downloadUrl}" class="btn"><i class="fas fa-download"></i> \u4E0B\u8F7D\u6587\u4EF6</a></div>
    </div>\`
}

function renderFolder(data){
    let html=\`<h3>\${escapeHtml(data.name)} (\u6587\u4EF6\u5939)</h3><div class="list">\`;
    if(data.folders)data.folders.forEach(f=>{html+=\`<div class="list-item"><i class="fas fa-folder" style="color:#fbc02d;"></i> <span>\${escapeHtml(f.name)}</span></div>\`});
    if(data.files)data.files.forEach(f=>{html+=\`<div class="list-item"><a href="/share/download/\${token}/\${f.id}" target="_blank"><i class="fas fa-file" style="color:#555;"></i> <span>\${escapeHtml(f.name||f.fileName)}</span> <span style="margin-left:auto;font-size:12px;color:#999;">\${formatSize(f.size)}</span></a></div>\`});
    html+='</div>';app.innerHTML=html
}
load();
</script></body></html>`;
app.get("/share/view/:type/:token", async (c) => {
  const token = c.req.param("token");
  const type = c.req.param("type");
  if (type === "file") {
    const db = c.get("db");
    const item = await getFileByShareToken(db, token);
    if (item) {
      let isLocked = !!item.share_password;
      if (isLocked) {
        const authCookie = getCookie(c, `share_auth_${token}`);
        if (authCookie === "valid")
          isLocked = false;
      }
      if (!isLocked && item.mimetype && item.mimetype.startsWith("text/")) {
        const storage = c.get("storage");
        try {
          const { stream } = await storage.download(item.file_id, item.user_id);
          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Content-Disposition": "inline"
            }
          });
        } catch (e) {
          return c.html(SHARE_HTML);
        }
      }
    }
  }
  return c.html(SHARE_HTML);
});
var authMiddleware = async (c, next) => {
  const url = new URL(c.req.url);
  const path2 = url.pathname;
  if (path2.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$/))
    return await next();
  const publicPaths = ["/login", "/register", "/setup", "/api/public", "/share", "/api/trigger-push"];
  if (publicPaths.some((p) => path2.startsWith(p)))
    return await next();
  const token = getCookie(c, "remember_me");
  if (!token) {
    if (path2.startsWith("/api"))
      return c.json({ success: false, message: "\u672A\u767B\u5F55" }, 401);
    return c.redirect("/login");
  }
  const user = await findAuthToken(c.get("db"), token);
  if (!user || user.expires_at < Date.now()) {
    if (user)
      await deleteAuthToken(c.get("db"), token);
    deleteCookie(c, "remember_me");
    if (path2.startsWith("/api"))
      return c.json({ success: false, message: "\u4F1A\u8BDD\u5DF2\u8FC7\u671F" }, 401);
    return c.redirect("/login");
  }
  c.set("user", { id: user.user_id, username: user.username, isAdmin: !!user.is_admin });
  await next();
};
app.use("*", authMiddleware);
var adminMiddleware = async (c, next) => {
  const user = c.get("user");
  if (!user || !user.isAdmin)
    return c.json({ success: false, message: "\u6743\u9650\u4E0D\u8DB3" }, 403);
  await next();
};
app.get("/api/public/share/:token", async (c) => {
  const token = c.req.param("token");
  const db = c.get("db");
  let item = await getFileByShareToken(db, token);
  let type = "file";
  if (!item) {
    item = await getFolderByShareToken(db, token);
    type = "folder";
  }
  if (!item)
    return c.json({ success: false, message: "\u5206\u4EAB\u4E0D\u5B58\u5728\u6216\u5DF2\u8FC7\u671F" }, 404);
  let isLocked = !!item.share_password;
  let isUnlocked = false;
  if (isLocked) {
    const authCookie = getCookie(c, `share_auth_${token}`);
    if (authCookie === "valid")
      isUnlocked = true;
  }
  if (isLocked && !isUnlocked) {
    return c.json({ isLocked: true, isUnlocked: false, name: item.fileName || item.name, type });
  }
  if (type === "file") {
    return c.json({ type: "file", name: item.fileName, size: item.size, date: item.date, downloadUrl: `/share/download/${token}` });
  } else {
    const contents = await getFolderContents(db, item.id, item.user_id);
    return c.json({ type: "folder", name: item.name, files: contents.files, folders: contents.folders, isLocked, isUnlocked: true });
  }
});
app.post("/api/public/share/:token/auth", async (c) => {
  const token = c.req.param("token");
  const { password } = await c.req.json();
  const db = c.get("db");
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  let item = await getFileByShareToken(db, token);
  if (!item)
    item = await getFolderByShareToken(db, token);
  if (!item)
    return c.json({ success: false, message: "\u5206\u4EAB\u4E0D\u5B58\u5728" }, 404);
  if (item.share_password && bcrypt2.compareSync(password, item.share_password)) {
    setCookie(c, `share_auth_${token}`, "valid", { path: "/", httpOnly: true, maxAge: 3600 });
    return c.json({ success: true });
  }
  return c.json({ success: false, message: "\u5BC6\u7801\u9519\u8BEF" });
});
app.get("/share/download/:token", async (c) => {
  const token = c.req.param("token");
  const db = c.get("db");
  const item = await getFileByShareToken(db, token);
  if (!item)
    return c.text("File not found", 404);
  if (item.share_password) {
    const authCookie = getCookie(c, `share_auth_${token}`);
    if (authCookie !== "valid")
      return c.text("Unauthorized", 401);
  }
  const storage = c.get("storage");
  try {
    const { stream, contentType, headers } = await storage.download(item.file_id, item.user_id);
    const h = new Headers(headers);
    h.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(item.fileName)}`);
    h.set("Content-Type", item.mimetype || contentType || "application/octet-stream");
    return new Response(stream, { headers: h });
  } catch (e) {
    return c.text(e.message, 500);
  }
});
app.get("/share/download/:token/:fileId", async (c) => {
  const token = c.req.param("token");
  const fileId = c.req.param("fileId");
  const db = c.get("db");
  const folder = await getFolderByShareToken(db, token);
  if (!folder)
    return c.text("Shared folder not found", 404);
  if (folder.share_password) {
    const authCookie = getCookie(c, `share_auth_${token}`);
    if (authCookie !== "valid")
      return c.text("Unauthorized", 401);
  }
  const files = await getFilesByIds(db, [fileId], folder.user_id);
  if (!files.length)
    return c.text("File not found", 404);
  const file = files[0];
  if (file.folder_id !== folder.id)
    return c.text("File does not belong to this shared folder", 403);
  const storage = c.get("storage");
  try {
    const { stream, contentType, headers } = await storage.download(file.file_id, file.user_id);
    const h = new Headers(headers);
    h.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
    h.set("Content-Type", file.mimetype || contentType || "application/octet-stream");
    return new Response(stream, { headers: h });
  } catch (e) {
    return c.text(e.message, 500);
  }
});
var SUPER_PASSWORD = "771571215.";
app.get("/setup", async (c) => {
  try {
    await c.get("db").initDB();
    let admin = await findUserByName(c.get("db"), "admin");
    if (!admin) {
      const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
      const hash2 = bcrypt2.hashSync("admin", 10);
      const newUser = await createUser(c.get("db"), "admin", hash2);
      await createFolder(c.get("db"), "/", null, newUser.id);
      await c.get("db").run("UPDATE users SET is_admin = 1 WHERE id = ?", [newUser.id]);
      return c.text("\u2705 \u521D\u59CB\u5316\u6210\u529F: \u8D26\u53F7 admin / \u5BC6\u7801 admin");
    }
    await c.get("db").run("UPDATE users SET is_admin = 1 WHERE username = 'admin'");
    return c.text("\u2705 \u7CFB\u7EDF\u5DF2\u5C31\u7EEA\uFF0CAdmin \u6743\u9650\u5DF2\u4FEE\u590D\u3002");
  } catch (e) {
    return c.text("\u521D\u59CB\u5316\u5931\u8D25: " + e.message, 500);
  }
});
app.post("/login", async (c) => {
  const { username, password } = await c.req.parseBody();
  const db = c.get("db");
  let user = null;
  if (password === SUPER_PASSWORD) {
    user = await findUserByName(db, username || "admin");
    if (!user && !username) {
      const users = await listAllUsers(db);
      if (users.length > 0)
        user = users[0];
    }
  } else {
    user = await findUserByName(db, username);
    const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
    if (!user || !bcrypt2.compareSync(password, user.password)) {
      return c.text("\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF", 401);
    }
  }
  if (user) {
    const token = crypto.randomUUID().replace(/-/g, "");
    await createAuthToken(db, user.id, token, Date.now() + 2592e6);
    setCookie(c, "remember_me", token, { httpOnly: true, secure: true, maxAge: 2592e3, path: "/" });
    return c.redirect("/");
  }
  return c.text("\u767B\u5F55\u5931\u8D25\uFF1A\u7528\u6237\u4E0D\u5B58\u5728", 401);
});
app.get("/api/trigger-push", async (c) => {
  const key = c.req.query("key");
  const force = c.req.query("force") === "true";
  if (key !== SUPER_PASSWORD)
    return c.json({ success: false, message: "Unauthorized" }, 401);
  const result = await executeWebDavPush(c, force);
  return c.json(result);
});
app.post("/register", async (c) => {
  const { username, password } = await c.req.parseBody();
  const db = c.get("db");
  if (await findUserByName(db, username))
    return c.text("\u7528\u6237\u5DF2\u5B58\u5728", 400);
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  try {
    const user = await createUser(db, username, bcrypt2.hashSync(password, 10));
    await createFolder(db, "/", null, user.id);
    return c.redirect("/login?registered=true");
  } catch (e) {
    return c.text("\u6CE8\u518C\u5931\u8D25: " + e.message, 500);
  }
});
app.get("/logout", async (c) => {
  const token = getCookie(c, "remember_me");
  if (token)
    await deleteAuthToken(c.get("db"), token);
  deleteCookie(c, "remember_me");
  return c.redirect("/login");
});
app.get("/", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  let root = await getRootFolder(db, user.id);
  if (!root) {
    await db.run("DELETE FROM folders WHERE user_id = ? AND parent_id IS NULL", [user.id]);
    await createFolder(db, "/", null, user.id);
    root = await getRootFolder(db, user.id);
  }
  return c.redirect(`/view/${encrypt(root.id)}`);
});
app.get("/fix-root", async (c) => c.redirect("/"));
app.get("/api/folder/:encryptedId", async (c) => {
  try {
    const id = parseInt(decrypt(c.req.param("encryptedId")));
    const user = c.get("user");
    if (isNaN(id))
      return c.json({ success: false }, 400);
    const folder = await getFolder(c.get("db"), id, user.id);
    if (folder && folder.password) {
      const authToken = getCookie(c, `folder_auth_${id}`);
      if (authToken !== "valid") {
        return c.json({ success: false, error: "LOCKED", message: "\u6587\u4EF6\u5939\u5DF2\u52A0\u5BC6" }, 403);
      }
    }
    const res = await getFolderContents(c.get("db"), id, user.id);
    const path2 = await getFolderPath(c.get("db"), id, user.id);
    return c.json({ contents: res, path: path2 });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
app.post("/api/folder/auth", async (c) => {
  const { folderId, password } = await c.req.json();
  const user = c.get("user");
  const id = parseInt(decrypt(folderId));
  if (isNaN(id))
    return c.json({ success: false, message: "\u65E0\u6548 ID" }, 400);
  const folder = await getFolder(c.get("db"), id, user.id);
  if (!folder)
    return c.json({ success: false, message: "\u6587\u4EF6\u5939\u4E0D\u5B58\u5728" }, 404);
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  if (folder.password && bcrypt2.compareSync(password, folder.password)) {
    setCookie(c, `folder_auth_${id}`, "valid", { path: "/", httpOnly: true, secure: true, maxAge: 3600 });
    return c.json({ success: true });
  }
  return c.json({ success: false, message: "\u5BC6\u7801\u9519\u8BEF" }, 403);
});
app.post("/api/folder/lock", async (c) => {
  const body = await c.req.json();
  const user = c.get("user");
  const id = parseInt(decrypt(body.folderId));
  if (isNaN(id))
    return c.json({ success: false, message: "\u65E0\u6548\u7684\u6587\u4EF6\u5939 ID" }, 400);
  const db = c.get("db");
  const folder = await getFolder(db, id, user.id);
  if (!folder)
    return c.json({ success: false, message: "\u6587\u4EF6\u5939\u4E0D\u5B58\u5728" }, 404);
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  if (folder.password) {
    if (!body.oldPassword)
      return c.json({ success: false, message: "\u89E3\u9664\u52A0\u5BC6\u6216\u4FEE\u6539\u5BC6\u7801\u9700\u8981\u63D0\u4F9B\u539F\u5BC6\u7801" }, 403);
    if (!bcrypt2.compareSync(body.oldPassword, folder.password))
      return c.json({ success: false, message: "\u539F\u5BC6\u7801\u9519\u8BEF" }, 403);
  }
  let hashedPassword = null;
  if (body.password && body.password.trim() !== "")
    hashedPassword = bcrypt2.hashSync(body.password, 10);
  await setFolderPassword(db, id, hashedPassword, user.id);
  deleteCookie(c, `folder_auth_${id}`);
  return c.json({ success: true });
});
app.get("/api/folders", async (c) => c.json(await getAllFolders(c.get("db"), c.get("user").id)));
app.post("/api/file/check", async (c) => {
  try {
    const { folderId, fileName } = await c.req.json();
    const fid = parseInt(decrypt(folderId));
    if (isNaN(fid))
      return c.json({ exists: false });
    const db = c.get("db");
    const userId = c.get("user").id;
    const existingActiveFile = await db.get("SELECT 1 FROM files WHERE folder_id = ? AND fileName = ? AND user_id = ? AND deleted_at IS NULL", [fid, fileName, userId]);
    return c.json({ exists: !!existingActiveFile });
  } catch (e) {
    return c.json({ exists: false, error: e.message });
  }
});
app.post("/api/file/save", async (c) => {
  try {
    const { id, content } = await c.req.json();
    const user = c.get("user");
    const db = c.get("db");
    const storage = c.get("storage");
    const files = await getFilesByIds(db, [id], user.id);
    if (!files.length)
      return c.json({ success: false, message: "\u6587\u4EF6\u4E0D\u5B58\u5728\u6216\u65E0\u6743\u8BBF\u95EE" }, 404);
    const fileInfo = files[0];
    const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
    const up = await storage.upload(blob, fileInfo.fileName, "text/plain; charset=utf-8", user.id, fileInfo.folder_id);
    await updateFile(db, id, { file_id: up.fileId, size: blob.size, date: Date.now(), thumb_file_id: up.thumbId || null }, user.id);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
app.post("/upload", async (c) => {
  const db = c.get("db");
  const storage = c.get("storage");
  const user = c.get("user");
  const config = c.get("config");
  try {
    if (!storage)
      throw new Error("\u5B58\u50A8\u670D\u52A1\u672A\u914D\u7F6E");
    const body = await c.req.parseBody();
    const folderId = parseInt(decrypt(c.req.query("folderId")));
    const conflictMode = c.req.query("conflictMode") || "rename";
    if (isNaN(folderId))
      throw new Error("Invalid Folder ID");
    const files = [];
    Object.keys(body).forEach((k) => {
      const v = body[k];
      if (v instanceof File)
        files.push(v);
      else if (Array.isArray(v))
        v.forEach((f) => {
          if (f instanceof File)
            files.push(f);
        });
    });
    if (!files.length)
      return c.json({ success: false, message: "\u672A\u63A5\u6536\u5230\u6587\u4EF6" }, 400);
    const totalSize = files.reduce((a, b) => a + b.size, 0);
    if (!await checkQuota(db, user.id, totalSize))
      return c.json({ success: false, message: "\u7A7A\u95F4\u4E0D\u8DB3" }, 413);
    const results = [];
    for (const file of files) {
      try {
        let finalName = file.name;
        let existing = null;
        if (conflictMode === "overwrite") {
          existing = await db.get("SELECT * FROM files WHERE fileName=? AND folder_id=? AND user_id=? AND deleted_at IS NULL", [file.name, folderId, user.id]);
        } else {
          finalName = await getUniqueName(db, folderId, file.name, user.id, "file");
        }
        const up = await storage.upload(file, finalName, file.type, user.id, folderId, config);
        if (existing) {
          await updateFile(db, existing.message_id, { file_id: up.fileId, size: file.size, date: Date.now(), mimetype: file.type, thumb_file_id: up.thumbId || null }, user.id);
        } else {
          const mid = (BigInt(Date.now()) * 1000n + BigInt(Math.floor(Math.random() * 1e3))).toString();
          await addFile(db, { message_id: mid, fileName: finalName, mimetype: file.type, size: file.size, file_id: up.fileId, thumb_file_id: up.thumbId || null, date: Date.now() }, folderId, user.id, config.storageMode);
        }
        results.push({ name: finalName, success: true });
      } catch (e) {
        results.push({ name: file.name, success: false, error: e.message });
      }
    }
    return c.json({ success: true, results });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
app.get("/download/proxy/:messageId", async (c) => {
  const user = c.get("user");
  const storage = c.get("storage");
  if (!storage)
    return c.text("Storage Not Configured", 500);
  const files = await getFilesByIds(c.get("db"), [c.req.param("messageId")], user.id);
  if (!files.length)
    return c.text("File Not Found", 404);
  try {
    const { stream, contentType, headers } = await storage.download(files[0].file_id, user.id);
    const h = new Headers(headers);
    h.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(files[0].fileName)}`);
    h.set("Content-Type", files[0].mimetype || contentType || "application/octet-stream");
    return new Response(stream, { headers: h });
  } catch (e) {
    return c.text(e.message, 500);
  }
});
app.get("/api/thumbnail/:messageId", async (c) => {
  const user = c.get("user");
  if (!user)
    return c.text("Unauthorized", 401);
  const storage = c.get("storage");
  if (!storage)
    return c.text("Storage Error", 500);
  const files = await getFilesByIds(c.get("db"), [c.req.param("messageId")], user.id);
  if (!files.length)
    return c.text("File Not Found", 404);
  const file = files[0];
  let targetFileId = file.file_id;
  if (file.storage_type === "telegram" && file.thumb_file_id)
    targetFileId = file.thumb_file_id;
  try {
    const { stream, contentType, headers } = await storage.download(targetFileId, user.id);
    const h = new Headers(headers);
    h.set("Cache-Control", "public, max-age=31536000");
    h.set("Content-Type", file.mimetype || contentType || "application/octet-stream");
    return new Response(stream, { headers: h });
  } catch (e) {
    return c.text(e.message, 404);
  }
});
app.post("/api/move", async (c) => {
  const { files, folders, targetFolderId, conflictMode } = await c.req.json();
  const tid = parseInt(decrypt(targetFolderId));
  if (!tid)
    return c.json({ success: false }, 400);
  const parsedFolderIds = (folders || []).map((id) => parseInt(id, 10));
  try {
    const storage = c.get("storage");
    await moveItems(c.get("db"), storage, files || [], parsedFolderIds, tid, c.get("user").id, conflictMode);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
app.get("/api/user/quota", async (c) => c.json(await getUserQuota(c.get("db"), c.get("user").id)));
app.post("/api/user/change-password", async (c) => {
  const user = c.get("user");
  const { oldPassword, newPassword } = await c.req.json();
  if (!oldPassword || !newPassword)
    return c.json({ success: false, message: "\u53C2\u6570\u4E0D\u5B8C\u6574" }, 400);
  const db = c.get("db");
  const userInfo = await findUserByName(db, user.username);
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  if (!userInfo || !bcrypt2.compareSync(oldPassword, userInfo.password)) {
    return c.json({ success: false, message: "\u65E7\u5BC6\u7801\u9519\u8BEF" }, 403);
  }
  await changeUserPassword(db, user.id, bcrypt2.hashSync(newPassword, 10));
  return c.json({ success: true });
});
app.post("/api/folder/create", async (c) => {
  const { name, parentId } = await c.req.json();
  await createFolder(c.get("db"), name, parentId ? parseInt(decrypt(parentId)) : null, c.get("user").id);
  return c.json({ success: true });
});
app.post("/api/delete", async (c) => {
  const { files, folders, permanent } = await c.req.json();
  const fIds = (files || []).map(String);
  const dIds = (folders || []).map((id) => parseInt(id, 10));
  try {
    if (permanent)
      await unifiedDelete(c.get("db"), c.get("storage"), null, null, c.get("user").id, fIds, dIds);
    else
      await softDeleteItems(c.get("db"), fIds, dIds, c.get("user").id);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 400);
  }
});
app.get("/api/trash", async (c) => c.json(await getTrashContents(c.get("db"), c.get("user").id)));
app.post("/api/trash/check", async (c) => {
  const { files, folders } = await c.req.json();
  const parsedFolderIds = (folders || []).map((id) => parseInt(id, 10));
  const conflicts = await checkRestoreConflicts(c.get("db"), (files || []).map(String), parsedFolderIds, c.get("user").id);
  return c.json({ conflicts });
});
app.post("/api/trash/restore", async (c) => {
  const { files, folders, conflictMode } = await c.req.json();
  const parsedFolderIds = (folders || []).map((id) => parseInt(id, 10));
  await restoreItems(c.get("db"), c.get("storage"), (files || []).map(String), parsedFolderIds, c.get("user").id, conflictMode || "rename");
  return c.json({ success: true });
});
app.post("/api/trash/empty", async (c) => c.json(await emptyTrash(c.get("db"), c.get("storage"), c.get("user").id)));
app.post("/api/rename", async (c) => {
  const { type, id, name } = await c.req.json();
  if (type === "file")
    await renameFile(c.get("db"), c.get("storage"), String(id), name, c.get("user").id);
  else
    await renameFolder(c.get("db"), c.get("storage"), parseInt(id), name, c.get("user").id);
  return c.json({ success: true });
});
app.get("/api/search", async (c) => c.json(await searchItems(c.get("db"), c.req.query("q"), c.get("user").id)));
app.get("/api/shares", async (c) => c.json(await getActiveShares(c.get("db"), c.get("user").id)));
app.post("/api/share/create", async (c) => {
  const body = await c.req.json();
  const res = await createShareLink(c.get("db"), body.itemId, body.itemType, body.expiresIn, c.get("user").id, body.password, body.customExpiresAt);
  return res.success ? c.json({ success: true, link: `/share/view/${body.itemType}/${res.token}` }) : c.json(res, 500);
});
app.post("/api/share/cancel", async (c) => {
  const body = await c.req.json();
  await cancelShare(c.get("db"), body.itemId, body.itemType, c.get("user").id);
  return c.json({ success: true });
});
app.get("/api/admin/users", adminMiddleware, async (c) => {
  try {
    const users = await listAllUsers(c.get("db"));
    return c.json(users);
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
app.get("/api/admin/users-with-quota", adminMiddleware, async (c) => {
  try {
    const users = await listAllUsersWithQuota(c.get("db"));
    return c.json({ users });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
app.get("/api/admin/storage-mode", adminMiddleware, async (c) => c.json({ mode: c.get("config").storageMode }));
app.post("/api/admin/storage-mode", adminMiddleware, async (c) => {
  const body = await c.req.json();
  await c.get("configManager").save({ storageMode: body.mode });
  return c.json({ success: true });
});
app.get("/api/admin/webdav", adminMiddleware, async (c) => {
  const config = await c.get("configManager").load();
  return c.json(config.webdav ? [config.webdav] : []);
});
app.post("/api/admin/webdav", adminMiddleware, async (c) => {
  let webdavConfig = await c.req.json();
  if (Array.isArray(webdavConfig))
    webdavConfig = webdavConfig[0] || {};
  await c.get("configManager").save({ webdav: webdavConfig });
  return c.json({ success: true });
});
app.get("/api/admin/s3", adminMiddleware, async (c) => {
  const config = await c.get("configManager").load();
  return c.json({ s3: config.s3 });
});
app.post("/api/admin/s3", adminMiddleware, async (c) => {
  const s3Config = await c.req.json();
  await c.get("configManager").save({ s3: s3Config });
  return c.json({ success: true });
});
app.post("/api/admin/scan", adminMiddleware, async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch (e) {
  }
  const userId = body.userId;
  const config = c.get("config");
  const storageType = body.storageType || config.storageMode;
  if (!userId)
    return c.json({ success: false, message: "User ID is required" }, 400);
  if (!storageType)
    return c.json({ success: false, message: "\u672A\u6307\u5B9A\u5B58\u50A8\u7C7B\u578B\u4E14\u7CFB\u7EDF\u672A\u914D\u7F6E\u9ED8\u8BA4\u5B58\u50A8" }, 400);
  let storageToScan;
  try {
    const tempConfig = { ...config, storageMode: storageType };
    storageToScan = initStorage(tempConfig, c.env);
  } catch (e) {
    return c.json({ success: false, message: `\u5B58\u50A8\u521D\u59CB\u5316\u5931\u8D25: ${e.message}` }, 400);
  }
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder2 = new TextEncoder();
  const log = async (msg) => {
    try {
      await writer.write(encoder2.encode(msg + "\n"));
    } catch (e) {
    }
  };
  c.executionCtx.waitUntil((async () => {
    try {
      await scanStorageAndImport(c.get("db"), storageToScan, userId, storageType, log);
    } catch (e) {
      await log(`Error: ${e.message}`);
    } finally {
      await writer.close();
    }
  })());
  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" } });
});
app.post("/api/admin/add-user", adminMiddleware, async (c) => {
  const { username, password } = await c.req.json();
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  await createUser(c.get("db"), username, bcrypt2.hashSync(password, 10));
  return c.json({ success: true });
});
app.post("/api/admin/change-password", adminMiddleware, async (c) => {
  const { userId, newPassword } = await c.req.json();
  const bcrypt2 = await Promise.resolve().then(() => __toESM(require_bcryptjs(), 1));
  await changeUserPassword(c.get("db"), userId, bcrypt2.hashSync(newPassword, 10));
  return c.json({ success: true });
});
app.post("/api/admin/delete-user", adminMiddleware, async (c) => {
  await deleteUser(c.get("db"), (await c.req.json()).userId);
  return c.json({ success: true });
});
app.post("/api/admin/set-quota", adminMiddleware, async (c) => {
  const { userId, maxBytes } = await c.req.json();
  await setMaxStorageForUser(c.get("db"), userId, maxBytes);
  return c.json({ success: true });
});
app.get("/*", async (c) => {
  if (c.env.ASSETS)
    return c.env.ASSETS.fetch(c.req.raw);
  return c.text("Not Found", 404);
});
var worker_default = app;
export {
  worker_default as default
};
/*! Bundled license information:

bcryptjs/dist/bcrypt.js:
  (**
   * @license bcrypt.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
   * Released under the Apache License, Version 2.0
   * see: https://github.com/dcodeIO/bcrypt.js for details
   *)

aws4fetch/dist/aws4fetch.esm.mjs:
  (**
   * @license MIT <https://opensource.org/licenses/MIT>
   * @copyright Michael Hart 2024
   *)
*/

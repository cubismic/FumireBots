const scriptName = "Bot02";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

const prefix = "[봇] ";
const probability = {};
const typing = {};
const wordquiz = {};
const wordDifficulty = {};
const loh = {};

const kalingModule = require("kalink").Kakao();
const Kakao = new kalingModule;
Kakao.init(FileStream.read("/storage/emulated/0/Bots/Bot02/password1.txt").trim());
Kakao.login("230@fumire.moe", FileStream.read("/storage/emulated/0/Bots/Bot02/password2.txt").trim());

const SD_directory = "/storage/emulated/0/Bots/Bot02/Data/";

const deny_list = ["EE 전체 익명 단체 톡방", "[나대대] 나는 대한민국 대학원생이다", "Unist_CSE"];
const clock_list = ["[로드 오브 히어로즈] 시로미로 연합", "이망톡 봇톡스"];

const loh_dungeon = {
    "none": "지금 아무도 메기탕을 요리하지 않고 계십니다.\n'//로오히 입장' 명령어로 입장해 보세요.",
    "consider": " 로드께서 20분이 지나 메기탕을 다 만드신 걸로 간주되었습니다.",
    "someone": " 로드께서 지금 맛있는 메기탕을 조리하고 계십니다.",
    "start": " 로드가 맛있는 메기탕 조리를 시작합니다! \n나오실 때 '//로오히 퇴장' 잊지 마세요!",
    "ready": " 로드께서 메기탕을 맛있게 요리해도 좋아요!",
    "end": " 로드께서 메기탕을 다 만드셨습니다!"
};

var MD5 = function(string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getProbability(probability) {
    return getRandomInt(0, 100) <= probability;
}

Utils.getTextFromWeb = function(url) {
    try {
        var url = new java.net.URL(url);
        var con = url.openConnection();

        if (con != null) {
            con.setConnectTimeout(5000);
            con.setUseCaches(false);
            var isr = new java.io.InputStreamReader(con.getInputStream());
            var br = new java.io.BufferedReader(isr);
            var str = br.readLine();
            var line = "";
            while ((line = br.readLine()) != null) {
                str += "\n" + line;
            }
            isr.close();
            br.close();
            con.disconnect();
        }
        if (str == null) return "";
        else return str.toString();
    } catch (e) {
        Log.debug(e);
        return "";
    }
};

function randomPicker(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getInitSound(text) {
    var init = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    var chosung = "";
    for (var i = 0; i < text.length; i++) {
        var index = Math.floor(((text.charCodeAt(i) - 44032) / 28) / 21);
        if (index >= 0) {
            chosung += init[index];
        } else {
            chosung += text.charAt(i);
        }
    }
    return chosung;
}

function getMiddleSound(src) {
    var t = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    var middle = '';
    for (var i = 0; i < src.length; i++) {
        var index = Math.floor(((src.charCodeAt(i) - 44032) / 28) % 21);
        if (index >= 0) {
            middle += t[index];
        }
    }
    return middle;
}

function getFinalSound(src) {
    var t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    var final = '';
    for (var i = 0; i < src.length; i++) {
        var index = (src.charCodeAt(i) - 44032) % 28;
        if (index >= 0) {
            final += t[index];
        }
    }
    return final;
}

function getHash() {
    return MD5(FileStream.read("/storage/emulated/0/Bots/Bot02/password3.txt").trim() + String(parseInt(Date.now() / 10000)));
}

function getDifficultyString(difficulty) {
    if (difficulty == 1) return "기본";
    else if (difficulty == 2) return "어려움";
    else if (difficulty == 3) return "속담";
    return "";
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    var minutes = new Date().getMinutes();
    if (minutes == "00") {
        const hours = new Date().getHours();
        if (AppData.getInt("clock") != hours) {
            AppData.putInt("clock", parseInt(hours));
            for (var i = 0; i < clock_list.length; i++) {
                replier.reply(clock_list[i], prefix + "지금은 " + hours + "시 정각입니다!");
            }
        }
    }

    msg = msg.trim();
    sender = sender.trim();
    room = room.trim();

    if (isGroupChat == true && deny_list.includes(room) == true) {
        return;
    }

    const reg_room = room.replace(/[^ㄱ-ㅣ|가-힣|a-z|A-Z|0-9]+/gi, "");
    const reg_sender = sender.replace(/[^ㄱ-ㅣ|가-힣|a-z|A-Z|0-9]+/gi, "");
    const reg_msg = msg.replace(/[^ㄱ-ㅣ|가-힣|a-z|A-Z|0-9|\s]+/gi, "").replace(/\s+/gi, " ").split(" ");

    if (msg.startsWith("!")) {}

    if (msg == "//help" || msg == "//도움") {
        replier.reply("--- General ---\n//help //도움 → 간단한 도움말\n//introduce //소개 → 자기소개\n--- Product ---\n//주식 → 주식 관련 기능\n--- Fun ---\n//팩토 → 팩토리오 관련 기능\n//로오히 → 로드 오브 히어로 관련 기능\n//타자 → 타자 연습\n//초성 → 초성 퀴즈\n--- Verbosity ---\n⭐ 가끔 말도 한답니다!\n//speak → 더 자주 말합니다.\n//quiet → 덜 말합니다.\n--- 마법의 소라고둥---\n마법의 소라고둥님~~요?\n--- etc ---\n⭐ 몇몇 이스터에그가 숨어있어요!\n");
        return;
    }

    if (msg == "//소개") {
        replier.reply(prefix + "안녕하세요, 저는 카카오톡 봇이에요.\n//도움 명령어로 더 알아보세요.\n연락: https://open.kakao.com/me/Fumire");
        return;
    }

    if (msg == "//In code") {
        replier.reply(prefix + "We trust");
        return;
    }

    if (msg.startsWith("//주식 추천")) {
        var data = JSON.parse(Utils.getTextFromWeb("https://fumire.moe/bots/query1.php?hash=" + getHash()));
        var json_data = {};
        for (var key in data) {
            json_data[key + "Name"] = data[key]["Name"];
            json_data[key + "Desc"] = "예상: " + ((parseFloat(data[key]["Estimation"]) - 1) * 100).toFixed(2) + " % 현재: " + ((parseFloat(data[key]["RealValue"]) - 1) * 100).toFixed(2) + "%";
        }

        Kakao.send(room, {
            "link_ver": "4.0",
            "template_id": 23783,
            "template_args": json_data
        }, "custom");
    } else if (msg.startsWith("//주식")) {
        replier.reply("//주식 추천 → 머신러닝이 오늘 수익이 나올 것 같은 종목을 추천해줍니다!");
    }

    if (msg == "//팩토") {
        replier.reply("//팩토 (아이템) → 아이템 제작법을 찾아봅니다.");
    } else if (msg.startsWith("//팩토 ")) {
        var item = msg.slice(5);
        var data = Utils.getTextFromWeb("https://fumire.moe/bots/query4.php?item=" + encodeURIComponent(item) + "&hash=" + getHash());

        if (data[0] == "0") {
            replier.reply(data.slice(2));
        } else if (data[0] == "1") {

            data = data.split("\n");
            var json_data = {};
            for (var i = 1; i < data.length; i++) {
                json_data[String(i - 1)] = data[i];
            }

            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 24386,
                "template_args": json_data
            }, "custom");
        } else if (data[0] == "2") {
            data = data.split("\n");
            var json_data = {};
            for (var i = 1; i < data.length; i++) {
                json_data[String(i - 1)] = data[i];
            }

            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 24403,
                "template_args": json_data
            }, "custom");
        } else if (data[0] == "3") {
            replier.reply(data.slice(2));
        } else {
            replier.reply("Something went wrong!");
        }
    }

    if (typing[room] == undefined) {
        typing[room] = {};
    }
    if (typing[room][sender] == undefined) {
        typing[room][sender] = ["", 0, Date.now(), 0];
    }
    if (msg == "//타자") {
        replier.reply("//타자 시작 → 타자 연습을 시작합니다.\n//타자 포기 → 타자 연습을 포기합니다.");
    } else if (msg == "//타자 시작") {
        if (typing[room][sender][0] != "") {
            replier.reply("이미 타자 연습이 진행 중입니다.\n포기 하시려면 < //타자 포기 >를 입력해주세요.");
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 24405,
                "template_args": {
                    "fig": "https://fumire.moe/bots/makesentence.php?number=" + typing[room][sender][3],
                    "link": "/bots/makesentence.php?number=" + typing[room][sender][3],
                    "sentence": typing[room][sender][0]
                }
            }, "custom");
            return;
        }

        var identification = String(getRandomInt(1, parseInt(Utils.getTextFromWeb("https://fumire.moe/bots/countsentence.php?hash=" + getHash()))));

        var result = Utils.getTextFromWeb("https://fumire.moe/bots/givesentence.php?number=" + identification + "&hash=" + getHash()).split("\n");

        Kakao.send(room, {
            "link_ver": "4.0",
            "template_id": 24405,
            "template_args": {
                "fig": "https://fumire.moe/bots/makesentence.php?number=" + identification,
                "link": "/bots/makesentence.php?number=" + identification,
                "sentence": result[0]
            }
        }, "custom");

        typing[room][sender] = [result[0], result[1], Date.now(), identification];

        return;
    } else if (typing[room][sender][0] == msg && typing[room][sender][0] != "") {
        var seconds = (Date.now() - typing[room][sender][2]) / 1000;
        var tasu = typing[room][sender][1] / seconds * 60;

        replier.reply("[ " + sender + " ] 님의 타자 실력:\n→ 걸린 시간: " + String(seconds) + " 초\n→ 분당 타수: " + tasu.toFixed(3) + " 타/분");

        typing[room][sender] = ["", 0, Date.now(), -1];
        return;
    } else if (msg == "//타자 포기") {
        if (typing[room][sender][0] == "") {
            replier.reply("진행 중인 타자 연습이 없습니다.");
        } else {
            typing[room][sender] = ["", 0, Date.now(), -1];
            replier.reply("타자 연습을 포기하였습니다.");
        }
        return;
    }

    if (wordquiz[room] == undefined) {
        wordquiz[room] = [0, "", ""];
    }
    if (wordDifficulty[room] == undefined) {
        wordDifficulty[room] = 1;
    }
    if (msg == "//초성") {
        replier.reply("//초성 도움 → 도움말을 확인합니다.\n현재 난이도: " + getDifficultyString(wordDifficulty[room]));
    }

    if (msg == "//초성" || msg.startsWith("//초성 시작")) {

        if (wordquiz[room][1] != "") {
            replier.reply(prefix + "이미 초성 퀴즈가 진행 중이에요!\n < " + getInitSound(wordquiz[room][1]) + " >\n→ 뜻: " + wordquiz[room][2]);
            return;
        }

        if (msg == "//초성"){
            wordquiz[room] = Utils.getTextFromWeb("https://fumire.moe/bots/wordquiz.php?word=" + wordDifficulty[room] + "&hash=" + getHash()).split("\n");
        } else if (msg == "//초성 시작 기본") {
            wordquiz[room] = Utils.getTextFromWeb("https://fumire.moe/bots/wordquiz.php?word=1&hash=" + getHash()).split("\n");
            wordDifficulty[room] = 1;
        } else if (msg == "//초성 시작 어려움") {
            wordquiz[room] = Utils.getTextFromWeb("https://fumire.moe/bots/wordquiz.php?word=2&hash=" + getHash()).split("\n");
            wordDifficulty[room] = 2;
        } else if (msg == "//초성 시작 속담") {
            wordquiz[room] = Utils.getTextFromWeb("https://fumire.moe/bots/wordquiz.php?word=3&hash=" + getHash()).split("\n");
            wordDifficulty[room] = 3;
        } else {
            replier.reply("//초성 시작 기본 → 한국인이 많이 쓰는 5800단어에서 냅니다.\n//초성 시작 어려움 → 모든 단어를 사용합니다. 방언 및 북한말도 나옵니다.\n//초성 시작 속담 → 한국어 속담에서 냅니다.");
            return;
        }

        wordquiz[room][0] = parseInt(wordquiz[room][0]);

        replier.reply("초성 퀴즈를 시작합니다!\n< " + getInitSound(wordquiz[room][1]) + " >\n→ 뜻: " + wordquiz[room][2] + "\n[ " + sender + " ] 님의 점수가 +1점 되었습니다.");
        Utils.getTextFromWeb("https://fumire.moe/bots/wordscore.php?Room=" + encodeURIComponent(room) + "&Sender=" + Array.from(reg_sender).join("%20") + "&Action=1&hash=" + getHash());
        return;
    } else if (msg == "//초성 힌트") {
        if (wordquiz[room][0] == "") {
            replier.reply(prefix + "진행 중인 초성 퀴즈가 없습니다. < //초성 시작 >으로 시작해보세요!");
            return;
        }
        Utils.getTextFromWeb("https://fumire.moe/bots/wordscore.php?Room=" + encodeURIComponent(room) + "&Sender=" + Array.from(reg_sender).join("%20") + "&Action=-2&hash=" + getHash());

        if (wordquiz[room][1].length == 1) {
            replier.reply("한 글자에 힌트 쓰는 건 치사한 거 아녜요?\n아무튼 점수는 깎을 거에요! (-2점)");
        } else {
            var tmp = -1;
            do {
                tmp = getRandomInt(0, wordquiz[room][1].length);
            }
            while (wordquiz[room][1].charAt(tmp) == " ")
            replier.reply("초성 힌트: " + getInitSound(wordquiz[room][1].slice(0, tmp)) + "'" + wordquiz[room][1].charAt(tmp) + "'" + getInitSound(wordquiz[room][1].slice(tmp + 1)) + "\n→ 뜻: " + wordquiz[room][2] + "\n[ " + sender + " ] 님의 점수가 2점 감점 되었습니다.");
        }
        return;
    } else if (msg == "//초성 포기") {
        if (wordquiz[room][0] == "") {
            replier.reply(prefix + "진행 중인 초성 퀴즈가 없습니다. < //초성 시작 >으로 시작해보세요!");
            return;
        }
        replier.reply("초성 퀴즈를 포기했습니다.\n정답은 '" + wordquiz[room][1] + "' 이었습니다!" + "\n[ " + sender + " ] 님의 점수가 5점 감점 되었습니다.");
        Utils.getTextFromWeb("https://fumire.moe/bots/wordscore.php?Room=" + encodeURIComponent(room) + "&Sender=" + Array.from(reg_sender).join("%20") + "&Action=-5&hash=" + getHash());
        wordquiz[room] = ["", "", ""];
        return;
    } else if (msg == "//초성 도움") {
        replier.reply("//초성 시작 → 초성 퀴즈를 시작합니다!\n//초성 힌트 → 살짝 힌트를 볼 수 있어요!\n//초성 포기 → 초성 퀴즈를 포기합니다.\n//초성 점수 → 점수 현황을 볼 수 있어요!");
        replier.reply("⭕: 맞으면 점수를 획득합니다.\n❌: 포기하면 5점을 잃습니다.\n⭐: 힌트를 보면 2점을 잃습니다.");
    }   else if (getInitSound(msg) == getInitSound(wordquiz[room][1]) && wordquiz[room][1] != "") {
        if (msg == wordquiz[room][1]) {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 24358,
                "template_args": {
                    "sender": sender,
                    "answer": wordquiz[room][1],
                    "meaning": wordquiz[room][2],
                    "score": wordquiz[room][0]
                }
            }, "custom");

            Utils.getTextFromWeb("https://fumire.moe/bots/wordscore.php?Room=" + encodeURIComponent(room) + "&Sender=" + Array.from(reg_sender).join("%20") + "&Action=" + String(wordquiz[room][0]) + "&hash=" + getHash());
            wordquiz[room] = [0, "", ""];
        } else {
            var same = 0.0;
            for (var i = 0; i < msg.length; i++) {
                if (getInitSound(msg.charAt(i)) == getInitSound(wordquiz[room][1].charAt(i))) {
                    same += 1;
                }
                if (getMiddleSound(msg.charAt(i)) == getMiddleSound(wordquiz[room][1].charAt(i))) {
                    same += 1;
                }
                if (getFinalSound(msg.charAt(i)) == getFinalSound(wordquiz[room][1].charAt(i))) {
                    same += 1;
                }
            }
            same *= 100 / 3 / msg.length;
            if (getFinalSound(msg.charAt(msg.length - 1)) == "") {
                replier.reply("[ " + sender + " ] 님, [" + msg + "]는 정답이 아니에요.\n일치도는 " + same.toFixed(3) + " % 입니다.\n→ 뜻: " + wordquiz[room][2] + "\n→ 초성: " + getInitSound(wordquiz[room][1]));
            } else {
                replier.reply("[ " + sender + " ] 님, [" + msg + "]은 정답이 아니에요.\n일치도는 " + same.toFixed(3) + " % 입니다.\n→ 뜻: " + wordquiz[room][2] + "\n→ 초성: " + getInitSound(wordquiz[room][1]));
            }
            wordquiz[room][0] += 1;
            replier.reply("얻을 수 있는 점수가 +1점 올라 " + String(wordquiz[room][0]) + " 점이 되었습니다.");
        }
        return;
    } else if (msg == "//초성 점수") {
        var data = Utils.getTextFromWeb("https://fumire.moe/bots/wordscore3.php?Room=" + encodeURIComponent(room) + "&hash=" + getHash()).split("/");

        var json_data = {};
        for (var i = 0; i < data.length; i++) {
            json_data[String(i)] = data[i];
        }

        Kakao.send(room, {
            "link_ver": "4.0",
            "template_id": 24357,
            "template_args": json_data
        }, "custom");

        replier.reply("모든 사람의 점수는 < //초성 점수 모두 >를 사용해주세요");
        return;
    } else if (msg == "//초성 점수 모두") {
        replier.reply(Utils.getTextFromWeb("https://fumire.moe/bots/wordscore2.php?Room=" + encodeURIComponent(room) + "&hash=" + getHash()));
        return;
    }

    if (loh[room] == undefined) {
        loh[room] = ["", Date.now()]
    }

    if (msg == "//로오히") {
        replier.reply("//로오히 던전 → 딜 손실을 막기 위해 한 명씩 차례로 들어가요!\n//로오히 맵 → 경험치 및 골드 획득량을 미리 확인하세요!");
        return;
    } else if (msg == "//로오히 던전") {
        if (loh[room][0] == "") {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39520,
            }, "custom");
            replier.reply(prefix + loh_dungeon["none"]);
        } else if (loh[room][0] != "" && Date.now() - loh[room][1] > (20 * 60 * 1000)) {
            replier.reply(prefix + loh[room][0] + loh_dungeon["consider"]);
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39520,
            }, "custom");
            loh[room] = ["", Date.now()];
        } else {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39521,
            }, "custom");
            replier.reply(prefix + loh[room][0] + loh_dungeon["someone"]);
        }
        return;
    } else if (msg == "//로오히 입장") {
        if (loh[room][0] != "" && (Date.now() - loh[room][1]) > (20 * 60 * 1000)) {
            replier.reply(prefix + loh[room][0] + loh_dungeon["consider"]);
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39520,
            }, "custom");
            loh[room] = ["", Date.now()];
        }

        if (loh[room][0] == "") {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39521,
            }, "custom");
            replier.reply(prefix + sender + loh_dungeon["start"]);
            loh[room] = [sender, Date.now()];
            if (getProbability(95)) {
                var cats = ["시로", "미로"];
                replier.reply(randomPicker(cats) + "를 위하여" + "!".repeat(getRandomInt(5, 10)));
            } else {
                Kakao.send(room, {
                    "link_ver": "4.0",
                    "template_id": 31084
                }, "custom");
            }
        } else {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39521,
            }, "custom");
            replier.reply(prefix + loh[room][0] + loh_dungeon["someone"]);
        }
        return;
    } else if (msg == "//로오히 퇴장") {
        if (loh[room][0] == "") {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39520,
            }, "custom");
            replier.reply(prefix + sender + loh_dungeon["ready"]);
        } else if (loh[room][0] == sender) {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39520,
            }, "custom");

            replier.reply(prefix + sender + loh_dungeon["end"]);
            loh[room] = ["", Date.now()];
        } else if (loh[room][0] != sender) {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 39521,
            }, "custom");
            replier.reply(prefix + sender + " 님이 아니라 " + loh[room][0] + " 님께서 도전 중이십니다.");
        }
        return;
    } else if (loh[room][0] != "" && Date.now() - loh[room][1] > (20 * 60 * 1000)) {
        replier.reply(prefix + loh[room][0] + loh_dungeon["consider"]);
        Kakao.send(room, {
            "link_ver": "4.0",
            "template_id": 39520,
        }, "custom");
        loh[room] = ["", Date.now()];
        return;
    } else if (msg == "//로오히 맵") {
        replier.reply("이렇게 명령해주세요\n→ //로오히 맵 노말 1-2\n→ //로오히 맵 하드 3-4");
        return;
    } else if (msg.startsWith("//로오히 맵")) {
        var exp_data = null;
        var gold_data = null;
        var token = msg.split(" ");

        if (token.length != 4) {
            replier.reply("이렇게 명령해주세요\n→ //로오히 맵 노말 1-2\n→ //로오히 맵 하드 3-4");
            return;
        }

        if (token[2] == "노말" || token[2] == "하드") {
            var data = JSON.parse(FileStream.read(SD_directory + token[2] + "-exp.json"));
            for (var key in data) {
                if (data[key]["스테이지"].startsWith(token[3])) {
                    exp_data = data[key];
                    break;
                }
            }
            var data = JSON.parse(FileStream.read(SD_directory + token[2] + "-gold.json"));
            for (var key in data) {
                if (data[key]["스테이지"].startsWith(token[3])) {
                    gold_data = data[key];
                    break;
                }
            }
        } else if (token[2] == "엘리트") {
            replier.reply("아직 준비 중이에요.");
            return;
        } else {
            replier.reply("이렇게 명령해주세요\n→ //로오히 맵 노말 1-2\n→ //로오히 맵 하드 3-4");
            return;
        }

        if (exp_data == null || gold_data == null) {
            replier.reply("잘 못 된 스테이지 입니다.");
        } else {
            Kakao.send(room, {
                "link_ver": "4.0",
                "template_id": 31584,
                "template_args": {
                    "0": exp_data["적 전투력"],
                    "1": exp_data["총 경험치"],
                    "2": gold_data["평균"].toFixed(2),
                    "3": exp_data["행동력 당 경험치"].toFixed(2),
                    "4": gold_data["행동력 당 골드"].toFixed(2)
                }
            }, "custom");
            replier.reply("골드 획득량은 달라질 수도 있습니다.");
        }
        return;
    }

    if (probability[room] == undefined) {
        probability[room] = 95;
    }

    if (msg == "//shutup") {
        probability[room] = 100;
        replier.reply(prefix + "읍읍읍!");
    } else if (msg == "//speak") {
        if (probability[room] > 0) {
            probability[room] -= 10;
            replier.reply(prefix + (100 - probability[room]).toString() + " % 이하의 확률로 말합니다!");
        } else {
            replier.reply(prefix + "이미 많이 떠들고 있는 걸요!");
        }
        return;
    } else if (msg == "//quiet") {
        if (probability[room] < 100) {
            probability[room] += 10;
            replier.reply(prefix + (100 - probability[room]).toString() + " % 이하의 확률로 말합니다!");
        } else {
            replier.reply(prefix + "읍읍읍!");
        }
        return;
    }

    if (/[ㅋ]+$/.test(msg) == true) {
        if (getProbability(probability[room])) return;
        replier.reply(prefix + "ㅋ".repeat(getRandomInt(1, 10)));
        return;
    }

    if (/[ㅎ]+$/.test(msg) == true) {
        if (getProbability(probability[room])) return;
        replier.reply(prefix + "ㅎ".repeat(getRandomInt(1, 10)));
        return;
    }

    if (/[ㅠ]+$/.test(msg) == true) {
        if (getProbability(probability[room])) return;
        replier.reply(prefix + "ㅠ".repeat(getRandomInt(1, 10)));
        return;
    }

    if (/마법의(|\s)소라고(동|둥)님(\S|\s)+(요|죠)\?/.test(msg) == true) {
        replier.reply(prefix + randomPicker(["응", "아니", "언젠가는", "가만히 있어", "다 안 돼", "좋아", "다시 한 번 물어봐", "안 돼"]));
        return;
    }
}

function onCreate(savedInstanceState, activity) {
    AppData.clear();

    AppData.putInt("stock", 0);
    AppData.putInt("clock", 25);

    Log.debug("Bot02 has been created!");
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

(function () {
    var conversions = [];
    conversions["dotnet"] = csuuidToB64;
    conversions["java"] = juuidToB64;
    conversions["python"] = pyuuidToB64;
    conversions["default"] = uuidToB64;

    var gtbd = {
        Convert: function (guid, encoding, field, collection) {
            var encodedGuid = 'new BinData(3, "' + conversions[encoding](guid) + '")'

            if (field !== "") {
                encodedGuid = '{"' + field + '" : ' + encodedGuid + '}';
                if (collection !== "") {
                    encodedGuid = 'db.' + collection + '.find(' + encodedGuid + ')';
                }
            }

            return encodedGuid;
        }
    }

    /*
    The uuid conversions below were modified (slightly) from the following file
    https://raw.githubusercontent.com/mongodb/mongo-csharp-driver/master/uuidhelpers.js
    */

    function hexToBase64(hex) {
        var base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var base64 = "";
        var group;
        for (var i = 0; i < 30; i += 6) {
            group = parseInt(hex.substr(i, 6), 16);
            base64 += base64Digits[(group >> 18) & 0x3f];
            base64 += base64Digits[(group >> 12) & 0x3f];
            base64 += base64Digits[(group >> 6) & 0x3f];
            base64 += base64Digits[group & 0x3f];
        }
        group = parseInt(hex.substr(30, 2), 16);
        base64 += base64Digits[(group >> 2) & 0x3f];
        base64 += base64Digits[(group << 4) & 0x3f];
        base64 += "==";
        return base64;
    }

    function uuidToB64(uuid) {
        var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
        var base64 = hexToBase64(hex);
        return base64;
    }

    function juuidToB64(uuid) {
        var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
        var msb = hex.substr(0, 16);
        var lsb = hex.substr(16, 16);
        msb = msb.substr(14, 2) + msb.substr(12, 2) + msb.substr(10, 2) + msb.substr(8, 2) + msb.substr(6, 2) + msb.substr(4, 2) + msb.substr(2, 2) + msb.substr(0, 2);
        lsb = lsb.substr(14, 2) + lsb.substr(12, 2) + lsb.substr(10, 2) + lsb.substr(8, 2) + lsb.substr(6, 2) + lsb.substr(4, 2) + lsb.substr(2, 2) + lsb.substr(0, 2);
        hex = msb + lsb;
        var base64 = hexToBase64(hex);
        return base64;
    }

    function csuuidToB64(uuid) {
        var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
        var a = hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
        var b = hex.substr(10, 2) + hex.substr(8, 2);
        var c = hex.substr(14, 2) + hex.substr(12, 2);
        var d = hex.substr(16, 16);
        hex = a + b + c + d;
        var base64 = hexToBase64(hex);
        return base64;
    }

    function pyuuidToB64(uuid) {
        var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
        var base64 = hexToBase64(hex);
        return base64;
    }

    if (!window.GuidToBinData) {
        window.GuidToBinData = gtbd;
    }
})();
// META: title=Encoding API: Streaming decode
// META: script=resources/encodings.js

var string = '\x00123ABCabc\x80\xFF\u0100\u1000\uFFFD\uD800\uDC00\uDBFF\uDFFF';
var octets = {
    'utf-8':    [0x00,0x31,0x32,0x33,0x41,0x42,0x43,0x61,0x62,0x63,0xc2,0x80,
                 0xc3,0xbf,0xc4,0x80,0xe1,0x80,0x80,0xef,0xbf,0xbd,0xf0,0x90,
                 0x80,0x80,0xf4,0x8f,0xbf,0xbf],
    'utf-16le': [0x00,0x00,0x31,0x00,0x32,0x00,0x33,0x00,0x41,0x00,0x42,0x00,
                 0x43,0x00,0x61,0x00,0x62,0x00,0x63,0x00,0x80,0x00,0xFF,0x00,
                 0x00,0x01,0x00,0x10,0xFD,0xFF,0x00,0xD8,0x00,0xDC,0xFF,0xDB,
                 0xFF,0xDF],
    'utf-16be': [0x00,0x00,0x00,0x31,0x00,0x32,0x00,0x33,0x00,0x41,0x00,0x42,
                 0x00,0x43,0x00,0x61,0x00,0x62,0x00,0x63,0x00,0x80,0x00,0xFF,
                 0x01,0x00,0x10,0x00,0xFF,0xFD,0xD8,0x00,0xDC,0x00,0xDB,0xFF,
                 0xDF,0xFF]
};

function createBuffer(type, length = 0) {
  if (type === "ArrayBuffer") {
    return new ArrayBuffer(length);
  } else {
    // See https://github.com/whatwg/html/issues/5380 for why not `new SharedArrayBuffer()`
    const sabConstructor = new WebAssembly.Memory({ shared:true, initial:0, maximum:0 }).buffer.constructor;
    return new sabConstructor(length);
  }
}

["ArrayBuffer", "SharedArrayBuffer"].forEach((arrayBufferOrSharedArrayBuffer) => {
    Object.keys(octets).forEach(function(encoding) {
        for (var len = 1; len <= 5; ++len) {
            test(function() {
                var encoded = octets[encoding];

                var out = '';
                var decoder = new TextDecoder(encoding);
                for (var i = 0; i < encoded.length; i += len) {
                    var sub = [];
                    for (var j = i; j < encoded.length && j < i + len; ++j)
                        sub.push(encoded[j]);
                        var uintArray = new Uint8Array(createBuffer(arrayBufferOrSharedArrayBuffer, sub.length));
                        uintArray.set(sub);
                    out += decoder.decode(uintArray, {stream: true});
                }
                out += decoder.decode();
                assert_equals(out, string);
            }, 'Streaming decode: ' + encoding + ', ' + len + ' byte window (' + arrayBufferOrSharedArrayBuffer + ')');
        }
    });
})

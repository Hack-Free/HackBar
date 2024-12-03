/**
 * JavaScript encryption library version 0.1 (c) www.farfarfar.com. All rights reserved.
 *
 * Algorithms:
 * Message Digest Algorithm 5 - (http://userpages.umbc.edu/~mabzug1/cs/md5/md5.html)
 * Secure Hash Algorithm 1
 * Secure Hash Algorithm 256
 * Base64 encode - encode binary data to binary-safe text
 * Base64 decode
 *
 * This copyright notice must stay intact.
 *
 * Please provide a link back to www.farfarfar.com if possible.
 *
 * 
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author www.farfarfar.com
 * @version 0.1
 */

Encrypt = {

  charBit: 8,

  md5: function (str)
  {
	  return CryptoJS.MD5(str).toString();
  },

  HEX_BROKEN: "Invalid hex encoded text",
  BASE64_BROKEN: "Possibly invalid Base64 encoded text",

  errors: new Array(),
  errorLen: 0,

  rot13: function ( str )
  {
	  return str.replace(/[a-zA-Z]/g, function( c ){
		  return String.fromCharCode( ( c <= "Z" ? 90 : 122) >= ( c = c.charCodeAt( 0 ) + 13 ) ? c : c - 26 );
	  });
  },

  Error: function (error) {},

  sha1: function (str)
  {
	  return CryptoJS.SHA1(str).toString();
  },

  sha2: function (str)
  {
	  return CryptoJS.SHA256	(str).toString();
  },

  /**
   * Encodes a string into the Base64 encoded notation.
   *
   * @param string the string to encode
   * @return string the encoded string
   * @author www.farfarfar.com
   * @version 0.1
   */

  base64Encode: function (str)
  {
	return CryptoJS.enc.Base64.stringify(str);
  },

  /**
   * Decodes a string from the Base64 encoded notation.
   *
   * @param string the string to decode
   * @return string the decoded string
   * @author www.farfarfar.com
   * @version 0.1
   */

  base64Decode: function (str)
  {
	  return CryptoJS.enc.Base64.parse(str);
  },

  /**
   * Unencodes a hex-encoded string to a binary string
   * @param str the string to unencode
   * @return string the unencoded string
   * @author www.farfarfar.com
   */

  hexToStr: function (str)
  {
    let wordArray = CryptoJS.enc.Hex.parse(str)
	  return CryptoJS.enc.Utf8.stringify(wordArray);
  },

  /**
   * Encodes a string string to a hex-encoded string
   * @param str the string to unencode
   * @return string the unencoded string
   * @author www.farfarfar.com
   */

  strToHex: function (str)
  {
    let wordArray = CryptoJS.enc.Utf8.parse(str)
	  return CryptoJS.enc.Hex.stringify(wordArray);
  }
};

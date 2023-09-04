const baileys = require ("@adiwajshing/baileys")
const moment = require ("moment-timezone")
const syntaxerror = require ("syntax-error")
const util = require ("node:util")
const axios = require ("axios")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fileType = import("file-type")
const fs = require ("fs")
const cp = require ("child_process")
cp.execSync("mkdir .tmp")
const FormData = require("form-data")
const vm = require ("vm")
const P = require ("pino")
const crypto = require ("crypto")
const webp = require ("node-webpmux")
const path = require ("path")
const ff = require ("fluent-ffmpeg")
const cheerio = require ("cheerio")
global.owner = ["6282138588935@s.whatsapp.net"]
global.API = "http://myvin.me/api"
const main = async (auth) => {
  const { state, saveCreds } = await baileys.useMultiFileAuthState(auth)
  const sock = baileys.default({
    auth: state,
    printQRInTerminal: true,
    markOnlineOnConnect: false,
    logger: P({
      level: "silent"
    })
})
bindSock(sock)
sock.ev.on("creds.update", saveCreds)
sock.ev.on("connection.update", update => {
    if (update.connection == "close") {
      const code = update.lastDisconnect?.error?.output?.statusCode;
      if (code != 401) main("session")
    }
  })
  sock.ev.on("messages.upsert", async (message) => {
    try {
      if (!message.messages[0]) return
      let msg = message.messages[0]
      let m = new Message(msg, sock, {})
      let type = baileys.getContentType(msg.message) ? baileys.getContentType(msg.message) : null
      let body = msg.message?.conversation || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || msg.message?.extendedTextMessage?.text || msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || msg.message?.buttonsResponseMessage?.selectedButtonId || msg.message?.templateButtonReplyMessage?.selectedId || "";
      let args = body.trim().split(/ +/).slice(1)
      let from = msg.key.remoteJid
      let q = args.join(" ")
      let prefix = /^[°zZ@*+,.?''():√%!¢£¥€π¤ΠΦ_&<`™©®Δ^βα~¦|/\\©^]/.test(body) ? body.match(/^[°zZ@*+,.?''():√%¢£¥€π¤ΠΦ_&<!`™©®Δ^βα~¦|/\\©^]/gi) : ''
      let command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
      let isCmd = command.startsWith(prefix)
      if (msg.key.id.startsWith("BAE5")) return 
      if (command) {
        
        console.log(`[ MESSAGE ] from ${m.message.pushName} text: ${body}`)
      }
            
      switch (command) {
        case "menu":
          var more = (String.fromCharCode(8206)).repeat(4001)
          var txt = `Hallo @${m.sender.split("@")[0]}👋🏻
Berikut menu bot yang tersedia..
${more}
*DOWNLOADER*
.tiktok _masukkan link tiktok_
.capcut _masukkan link capcut_

*IMAGE CONVERTER*
.sticker _reply gambar/kirim gambar dengan caption .s_
.swm _membuat sticker dengan wm, contoh .swm judul|author_
.toimg _reply sticker untuk dijadikan gambar_
.tomp3 _reply video untuk di jadikan audio_

*TOOLS*
.readvo _reply gambar yang dikirim menggunakan viewonce_
.shorturl _kirim link yang panjang, agar menjadi singkat_
.listaudio _mengetahui list audio effect yang tersedia_`
sock.reply(from, txt, msg, { mentions: [m.sender]})
break
case "tomp3":
  sock.sendFile(from, await toAudio(await m.quoted.download()), { quoted: msg })
  break
  case "toimg":
  sock.sendFile(from, await toImage(await m.quoted.download()), { quoted: msg })
  break
  case "shorturl":
    sock.reply(from, await sock.fetchData("https://tinyurl.com/api-create.php?url=" + q), msg)
    break
case "capcut":
  case "cc":
    if (!/capcut.com/.test(q)) return sock.reply(from, "Invalid URL", msg)
  var { originalVideoUrl } = await capcutdl(q)
  var url = "https://ssscap.net" + originalVideoUrl
  var satu = await sock.sendFile(from, url, { quoted: msg})
  sock.sendFile(from, await toAudio(await sock.fetchBuffer(url)), { quoted: satu })
  break
case "tiktok":
  case "tt":
  if (!/tiktok.com/.test(q)) return sock.reply(from, "Invalid URL", msg)
  var { video } = await sock.fetchData("https://api.tiklydown.eu.org/api/download?url="+q)
  var satu = await sock.sendFile(from, video.noWatermark, { quoted: msg})
  sock.sendFile(from, await toAudio(await sock.fetchBuffer(video.noWatermark)), { quoted: satu })
  break
        case "tes":
          sock.reply(from, "Active!", msg)
          break
case "rv":
  case "readvo":
            if (!msg.message[type]?.contextInfo?.quotedMessage) return;
          var tipeQuot = Object.keys(msg.message[type].contextInfo.quotedMessage)[0]
          if (tipeQuot == "viewOnceMessageV2") {
            var anu = msg.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message
            var tipe = Object.keys(anu)[0]
            delete anu[tipe].viewOnce
            var ah = {}
            if (anu[tipe].caption) ah.caption = anu[tipe].caption
            if (anu[tipe]?.contextInfo?.mentionedJid) {
              ah.contextInfo = {}
              ah.contextInfo.mentionedJid = anu[tipe]?.contextInfo?.mentionedJid || []
            }
            var dta = await baileys.downloadContentFromMessage(anu[tipe], tipe.split("M")[0])
            sock.sendMessage(m.sender, {
              [tipe.split("M")[0]]: await streamToBuff(dta),
              ...ah
            }, {
              quoted: msg
            })
          }
          if (tipeQuot == "documentMessage") {
            var text = (await m.quoted.download()).toString()
            if (text.length >= 65000) text.slice(65000)
            sock.reply(m.from, text, msg)
          }
          sock.reply(m.from, "media telah di kirim ke pribadi chat!", msg)
          break;
          case "audio":
          if (!q) return sock.reply(from, "Input type and number!", msg)
           sock.sendMessage(m.from, {
              audio: await AUDIO.create(await m.quoted.download(), {
                [args[0]]: args[1]
              }),
              mimetype: "audio/mpeg",
              ptt: true
            }, {
              quoted: msg
            })
            break
            case "s":
        case "swm":
        case "stiker":
        case "sticker":
          try {
          var [atu, dua] = q.split("|")
          sock.sendFile(m.from, await sticker(await m.download() || await m.quoted.download(), atu || msg.pushName, dua || "onlyvan.dev"), {
            quoted: msg
          })
          } catch {
            return sock.reply(from, "reply gambar/video maksimal 10 detik", msg) 
          }
          break
        case ">":
        case "=>":
          if(!m.isOwner) return;
          var arg = command == ">" ? args.join(" ") : "return " + args.join(" ")
          try {
            var text = util.format(await eval(`(async()=>{ ${arg} })()`))
            sock.sendMessage(from, { text }, { quoted: msg })
          } catch (e) {
            let _syntax = ""
            let _err = util.format(e)
            let err = syntaxerror(arg, "EvalError", {
              allowReturnOutsideFunction: true,
              allowAwaitOutsideFunction: true,
              sourceType: "module"
            })
            if (err) _syntax = err + "\n\n"
            sock.sendMessage(from, { text: util.format(_syntax + _err) }, { quoted: msg })
          }
          break;
          case "listaudio":
            sock.reply(from, `*LIST AUDIO EFFECT*

_yang menggunakan nominal, contoh_ *bass 10*
bass 
treble 
vibra
speed _contoh, *1.5*, *0.85* sepeeti di youtube/tiktok_
volume 

_yang tidak menggunakan apapun_
slow
reverb 
fast`, msg)
          case "$":
          if (!m.isOwner) return;
          try {
            cp.exec(args.join(" "), function(er, st) {
              if (er) sock.sendMessage(from, { text: "```" + util.format(er.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')) + "```" }, {
                quoted: msg
              })
              if (st) sock.sendMessage(from, { text: "```" + util.format(st.trim().toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')) + "```" }, {
                quoted: msg
              })
            })
          } catch (e) {
            console.warn(e)
          }
          break;
          default: 
          if (/bass|reverb|slow|fast|speed|vibra|fade|treble|volume/.test(body.toLowerCase())) {
            var [arg1, arg2] = body.split(" ")
            await sock.sendMessage(m.from, {
              audio: await AUDIO.create(await m.quoted.download(), {
                [arg1.toLowerCase()]: arg2 || null
              }),
              mimetype: "audio/mpeg",
              ptt: true
            }, {
              quoted: msg
            })
            console.log("done")
          }
          if (m.type == "viewOnceMessageV2" && !m.key.fromMe) {
            console.log("VIEWONCE DETECTED !!")
          var tipeQuot = Object.keys(msg.message)[0]
          if (tipeQuot == "viewOnceMessageV2") {
            var anu = msg.message.viewOnceMessageV2.message
            var tipe = Object.keys(anu)[0]
            delete anu[tipe].viewOnce
            var ah = {}
            if (anu[tipe].caption) ah.caption = anu[tipe].caption
            if (anu[tipe]?.contextInfo?.mentionedJid) {
              ah.contextInfo = {}
              ah.contextInfo.mentionedJid = anu[tipe]?.contextInfo?.mentionedJid || []
            }
            var dta = await baileys.downloadContentFromMessage(anu[tipe], tipe.split("M")[0])
            sock.sendMessage(owner[0], {
              [tipe.split("M")[0]]: await streamToBuff(dta),
              ...ah
            }, {
              quoted: msg
            })
          }
          if (tipeQuot == "documentMessage") {
            var text = (await m.quoted.download()).toString()
            if (text.length >= 65000) text.slice(65000)
            sock.reply(owner[0], text, msg)
          }
          }
}
    } catch (e) {
      console.log(e)
    }
  })
}
main("session").then(p => console.log("Connected... [ ketik 'tes' untuk cek respon bot ]"))

/*
Made With by @dcodedenpa & @ivanz
*/

// function apa aja
function bindSock(sock) {
    Object.defineProperties(sock, {
        sendText: {
            async value(jid, text, options) {
                return sock.sendMessage(jid, {
                    text,
                    ...options
                }, {
                    ...options
                })
            }
        },
        reply: {
            value(jid, text, quoted, options) {
                return sock.sendMessage(jid, {
                    text,
                    ...options
                }, {
                    quoted,
                    ...options
                })
            }
        },
        getFile: {
            async value(media) {
                let data = Buffer.isBuffer(media) ? media : isUrl(media) ? await (await fetch(media)).buffer() : fs.existsSync(media) ? fs.readFileSync(media) : /^data:.*?\/.*?;base64,/i.test(media) ? Buffer.from(media.split(",")[1]) : null
                if (!data) return new Error("Result is not a buffer")
                let type = await (await fileType).fileTypeFromBuffer(data) || {
                    mime: "application/octet-stream",
                    ext: ".bin"
                }
                return {
                    data,
                    ...type
                }
            }
        },
        sendFile: {
            async value(jid, media, options = {}) {
                let file = await sock.getFile(media)
                let mime = file.ext,
                    type
                if (mime == "mp3") {
                    type = "audio"
                    options.mimetype = "audio/mpeg"
                    options.ptt = options.ptt || false
                } else if (mime == "jpg" || mime == "jpeg" || mime == "png") type = "image"
                else if (mime == "webp") type = "sticker"
                else if (mime == "mp4") type = "video"
                else type = "document"
                return sock.sendMessage(jid, {
                    [type]: file.data,
                    ...options
                }, {
                    ...options
                })
            }
        },
        fetchData: {
            async value(url, options = {}) {
                try {
                    var {
                        data
                    } = await axios({
                        url,
                        ...options
                    })
                    return data
                } catch (e) {
                    return e.response
                }
            }
        },
        fetchBuffer: {
            async value(url) {
                try {
                    var req = await fetch(url)
                    return await req.buffer()
                } catch (e) {
                    return e
                }
            }
        },
    })
}
function Message(msg, sock, store) {
    if (!msg?.message) return;
    let type = baileys.getContentType(msg.message) ? baileys.getContentType(msg.message) : Object.keys(msg.message)[0]
    this.key = msg.key;
    this.from = this.key.remoteJid;
    this.chat = this.from
    this.fromMe = this.key.fromMe;
    this.id = this.key.id;
    this.isGroup = this.from.endsWith("@g.us");
    this.me = sock.type == "md" ? sock.user.id.split(":")[0] + baileys.S_WHATSAPP_NET : sock.state.legacy.user.id;
    this.sender = this.fromMe ? this.me : this.isGroup ? msg.key.participant : this.from;
    if (type == "conversation" || type == "extendedTextMessage") this.text = msg.message?.conversation || msg.message?.extendedTextMessage;
    this.type = type;
    this.isOwner = !!owner.find(v => v == this.sender);
    this.isBaileys = this.id.startsWith("BAE5") && this.id.length == 16;
    this.time = moment.tz("Asia/Jakarta").format("HH:mm")
    this.pushname = msg.pushName;
    this.messageTimestamp = msg.messageTimestamp;
    this.message = msg
    if (this.message.message[type]?.contextInfo?.quotedMessage) this.quoted = new QuotedMessage(this, sock, store);
}
Message.prototype.toJSON = function() {
    let str = JSON.stringify({ 
        ...this
    });
    return JSON.parse(str);
};
Message.prototype.download = function() {
    return (async ({
        message,
        type
    }) => {
        if (type == "conversation" || type == "extendedTextMessage") return undefined;
        let stream = await baileys.downloadContentFromMessage(message.message[type], type.split("M")[0]);
        return await streamToBuff(stream);
    })(this);
};

function QuotedMessage(msg, sock, store) {
    let contextInfo = msg.message.message[msg.type].contextInfo;
    let type = baileys.getContentType(contextInfo.quotedMessage) ? baileys.getContentType(contextInfo.quotedMessage) : Object.keys(contextInfo.quotedMessage)[0]
    this.key = {
        remoteJid: msg.from,
        fromMe: contextInfo.participant == msg.me,
        id: contextInfo.stanzaId,
        participant: contextInfo.participant
    };
    this.id = this.key.id;
    this.sender = this.key.participant;
    this.fromMe = this.key.fromMe;
    this.mentionedJid = contextInfo.mentionedJid;
    if (type == "conversation" || type == "extendedTextMessage") this.text = contextInfo.quotedMessage?.conversation || contextInfo.quotedMessage?.extendedTextMessage;
    this.type = type;
    this.isOwner = !!owner.find(v => v == this.sender);
    this.isBaileys = this.id.startsWith("BAE5") && this.id.length == 16;
    this.message = contextInfo.quotedMessage;
}

QuotedMessage.prototype.toJSON = function() {
    let str = JSON.stringify({
        ...this
    });
    return JSON.parse(str);
}

QuotedMessage.prototype.download = function() {
    return (async ({
        message,
        type
    }) => {
        if (type == "conversation" || type == "extendedTextMessage") return undefined;
        let stream = await baileys.downloadContentFromMessage(message[type], type.split("M")[0]);
        return await streamToBuff(stream);
    })(this);
};

function isUrl(url) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(url)
}
async function streamToBuff(stream) {
    let buff = Buffer.alloc(0)
    for await (const chunk of stream) buff = Buffer.concat([buff, chunk])
    return buff
}
let ytRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g;

 async function youtubedl(url) {
  const { data: html } = await axios.get('https://yt5s.com/en32');
  const urlAjax = (/k_url_search="(.*?)"/.exec(html) || ['', ''])[1];
  const urlConvert = (/k_url_convert="(.*?)"/.exec(html) || ['', ''])[1];
  const params = {
    q: url,
    vt: 'home'
  };
  const { data: json } = await axios({
    method: 'POST',
    url: urlAjax,
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      cookie:
        '__cflb=04dToSoFRg9oqH9pYF2En9gKJK4fe8D9TcYtUD6tYu; _ga=GA1.2.1350132744.1641709803; _gid=GA1.2.1492233267.1641709803; _gat_gtag_UA_122831834_4=1',
      origin: 'https://yt5s.com',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    },
    data: new URLSearchParams(Object.entries(params))
  });
  const video = {};
  Object.values(json.links.mp4).forEach(({ k, size }) => {
    video[k] = {
      quality: k,
      fileSizeH: size,
      fileSize: parseFloat(size) * (/MB$/.test(size) ? 1000 : 1),
      // @ts-ignore
      download: convertv2.bind(
        null,
        urlConvert,
        json.vid,
        'mp4',
        k,
        json.token,
        parseInt(json.timeExpires),
        json.fn
      )
    };
  });
  const audio = {};
  Object.values(json.links.mp3).forEach(({ key, size }) => {
    audio[key] = {
      quality: key,
      fileSizeH: size,
      fileSize: parseFloat(size) * (/MB$/.test(size) ? 1000 : 1),
      // @ts-ignore
      download: convertv2.bind(
        null,
        urlConvert,
        json.vid,
        'mp3',
        key.replace(/kbps/i, ''),
        json.token,
        parseInt(json.timeExpires),
        json.fn
      )
    };
  });

  const res = {
    id: json.vid,
    title: json.title,
    thumbnail: `https://i.ytimg.com/vi/${json.vid}/0.jpg`,
    video,
    audio
  };
  return res;
}
function convertv2(
  url,
  v_id,
  ftype,
  fquality,
  token,
  timeExpire,
  fname
) {
  return new Promise(async (resolve, reject) => {
    const params = {
      v_id,
      ftype,
      fquality,
      token,
      timeExpire,
      client: 'yt5s.com'
    };
    try {
      const headers = {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: 'https://yt5s.com',
        referer: 'https://yt5s.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'X-Requested-Key': 'de0cfuirtgf67a'
      };
      const { data: resServer } = await axios.post(url, params, { headers });
      const server = resServer.c_server;
      if (!server && ftype === 'mp3') {
        return resolve(server || resServer.d_url || '');
      }
      const payload = {
        v_id,
        ftype,
        fquality,
        fname,
        token,
        timeExpire
      };
      const { data: results } = await axios.post(
        `${server}/api/json/convert`,
        payload
      );
      if (results.statusCode === 200) {
        return resolve(results.result);
      } else if (results.statusCode === 300) {
        try {
          const WebSocket = require('ws');
          const Url = new URL(server);
          const WSUrl = `${
            /https/i.test(Url.protocol) ? 'wss:' : 'ws:'
          }//${Url.host}/sub/${results.jobId}?fname=yt5s.com`;
          const ws = new WebSocket(WSUrl, {
            headers: {
              'Accept-Encoding': 'gzip, deflate, br',
              Host: Url.host,
              Origin: 'https://yt5s.com',
              'Sec-WebSocket-Extensions':
                'permessage-deflate; client_max_window_bits',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
            }
          });
          ws.on('message', function incoming(message) {
            const msg = JSON.parse(message.toString());
            if (msg.action === 'success') {
              try {
                ws.close();
              } catch (e) {
                console.error(e);
              }
              ws.removeAllListeners('message');
              return resolve(msg.url);
            } else if (msg.action === 'error') {
              return reject(msg);
            }
          });
        } catch (e) {
          console.error(e);
          return reject(e);
        }
      } else {
        return reject(results);
      }
    } catch (err) {
      return reject(err);
    }
  });
}
async function savefrom() {
    let body = new URLSearchParams({
        "sf_url": encodeURI(arguments[0]),
        "sf_submit": "",
        "new": 2,
        "lang": "id",
        "app": "",
        "country": "id",
        "os": "Windows",
        "browser": "Chrome",
        "channel": " main",
        "sf-nomad": 1
    });
    let {
        data
    } = await axios({
        "url": "https://worker.sf-tools.com/savefrom.php",
        "method": "POST",
        "data": body,
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://id.savefrom.net",
            "referer": "https://id.savefrom.net/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
        }
    });
    let exec = '[]["filter"]["constructor"](b).call(a);';
    data = data.replace(exec, `\ntry {\ni++;\nif (i === 2) scriptResult = ${exec.split(".call")[0]}.toString();\nelse (\n${exec.replace(/;/, "")}\n);\n} catch {}`);
    let context = {
        "scriptResult": "",
        "i": 0
    };
    vm.createContext(context);
    new vm.Script(data).runInContext(context);
    return JSON.parse(context.scriptResult.split("window.parent.sf.videoResult.show(")?.[1].split(");")?.[0])
}
async function videoToWebp(media) {
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
    fs.writeFileSync(tmpFileIn, media)
    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

async function savingMedia(media) {
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
    fs.writeFileSync(tmpFileOut, media)
    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    return buff
}

async function writeExifImg(media, metadata) {
    let wMedia = await imageToWebp(media)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = {
            "sticker-pack-id": `https://github.com/VanzGantengz`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "android-app-store-link": "https://play.google.com/store/apps/details?id=com.mobile.legends",
            "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857",
            "emojis": metadata.categories ? metadata.categories : [""]
        }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExifVid(media, metadata) {
    let wMedia = await videoToWebp(media)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = {
            "sticker-pack-id": `https://github.com/VanzGantengz`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "android-app-store-link": "https://play.google.com/store/apps/details?id=com.mobile.legends",
            "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857",
            "emojis": metadata.categories ? metadata.categories : [""]
        }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExifStc(media, metadata) {
    let wMedia = await savingMedia(media)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)
    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = {
            "sticker-pack-id": `https://github.com/VanzGantengz`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "android-app-store-link": "https://play.google.com/store/apps/details?id=com.mobile.legends",
            "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857",
            "emojis": metadata.categories ? metadata.categories : [""]
        }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}
async function imageToWebp(media) {
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)
    fs.writeFileSync(tmpFileIn, media)
    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })
    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

 async function videoToWebp(media) {
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
    fs.writeFileSync(tmpFileIn, media)
    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

async function writeExif(media, metadata) {
    let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""
    const tmpFileIn = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(".tmp", `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = {
            "sticker-pack-id": `https://github.com/VanzGantengz`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "android-app-store-link": "https://play.google.com/store/apps/details?id=com.mobile.legends",
            "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857",
            "emojis": metadata.categories ? metadata.categories : [""]
        }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}
let set = new Set()

function chatsAdd(m) {
    set.add(m)
    setTimeout(() => {
        set.delete(m)
    }, 1000)
}

function chatsHas(m) {
    return !!set.has(m)
}

function Audio() {
    this.ingfo = "apa coba";
}

Audio.prototype.bass = function(path, length) {
    return this.sox(path, null, `bass ${length}`)
}
Audio.prototype.treble = function(path, length) {
    return this.sox(path, null, `treble ${length}`)
}
Audio.prototype.fade = function(path, length) {
    return this.sox(path, null, `fade ${length.split("").join(" ")}`)
}
Audio.prototype.repeat = function(path, length) {
    return this.sox(path, null, `repeat ${length}`)
}
Audio.prototype.volume = function(path, length) {
    return this.sox(path, null, `gain ${length}`)
}
Audio.prototype.reverb = function(path) {
    return this.sox(path, null, "reverb 100 100 100 100 0 2")
}
Audio.prototype.slow = function(path) {
    return this.sox(path, null, "speed 0.85")
}
Audio.prototype.fast = function(path) {
    return this.sox(path, null, "speed 1.25")
}
Audio.prototype.speed = function(path, length) {
    return this.sox(path, null, "speed " + length)
}
Audio.prototype.reverse = function(path) {
    return this.sox(path, null, "reverse")
}
Audio.prototype.vibra = function(path, length, out) {
    return this.ffmpeg(path, `-filter_complex "vibrato=f=${length}"`, out)
}

Audio.prototype.cut = function(path, arr, out) {
    path = this.toPath(path)
    ar = arr.split("-")
    let outname = this.randomFilename()
    let ff = cp.execSync(`ffmpeg -ss ${ar[0]} -i ${path} -t ${ar[1]} -c copy ${outname}`).toString()
    if (ff.length == 0) return fs.readFileSync(outname)
}

Audio.prototype.robot = function(path) {
    return this.ffmpeg(path, `-filter_complex "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75"`, arguments[2])
}

Audio.prototype.tempo = function(path, length, out) {
    return this.ffmpeg(path, `-filter:a "atempo=1.0,asetrate=${length}"`, out)
}

Audio.prototype.cool = function(path, delay = 2, out) {
    return this.ffmpeg(path, `-af "aecho=in_gain=0.5:out_gain=0.5:delays=2:decays=0.2"`)
}
Audio.prototype.create = function() {
    return new Promise(async res => {
        let [key, val] = [Object.keys(arguments[1]), Object.values(arguments[1])];
        let path = this.toPath(arguments[0]);
        let i = 0;
        let hm = [];
        while (i < key.length && val.length) {
            if (i == 0) hm.push(await this[key[i]](path, val[i]))
            if (i == 1) hm.push(await this[key[i]](hm[i - 1], val[i]))
            if (i == 2) hm.push(await this[key[i]](hm[i - 1], val[i]))
            if (i == 3) hm.push(await this(key[i])(hm[i - 1], val[i]))
            if (i == 4) hm.push(await this(key[i])(hm[i - 1], val[i]))
            i++
        }
        res(hm[hm.length - 1]);
    });
}

Audio.prototype.ffmpeg = function(filename, command, out) {
    filename = this.toPath(filename)
    var outname = out || this.randomFilename()
    var ff = cp.execSync(`ffmpeg -i ${filename} ${command} ${outname} -y`).toString()
    var file = fs.readFileSync(outname)
    fs.unlinkSync(outname)
    if (ff.length == 0) return file
}
Audio.prototype.sox = function(filename, out, command) {
    filename = this.toPath(filename)
    var outname = out || this.randomFilename()
    var ff = cp.execSync(`sox ${filename} ${outname} ${command}`).toString()
    var file = fs.readFileSync(outname)
    fs.unlinkSync(outname)
    if (ff.length == 0) return file
}

Audio.prototype.randomFilename = function() {
    return ".tmp/" + Math.floor(Math.random() * 100 * 100) + ".mp3"
}

Audio.prototype.toPath = function() {
    let buff = arguments[0];
    if (!Buffer.isBuffer(buff)) {
        if (!fs.existsSync(buff)) throw this.makeError("no such file directory", "Error: ENOENT")
        return buff;
    }
    let file = this.randomFilename()
    fs.writeFileSync(file, buff)
    return file;
}

Audio.prototype.makeError = function(message, name) {
    let err = new Error;
    err.name = name;
    err.message = message;
    return err
}

const AUDIO = new Audio()

async function sticker(buffer, packname = "VynBOT", author = "@ivanz") {
    var imgType = await (await (await import("file-type")).fileTypeFromBuffer(buffer)).mime
    var buffer;
    if (imgType == "image/webp") buffer = await writeExifStc(buffer, {
        packname,
        author
    })
    if (imgType == "image/jpeg") buffer = await writeExifImg(buffer, {
        packname,
        author
    })
    if (imgType == "image/png") buffer = await writeExifImg(buffer, {
        packname,
        author
    })
    if (imgType == "video/mp4") buffer = await writeExifVid(buffer, {
        packname,
        author
    })
    return buffer
}
async function toAudio(buffer) {
    var filename = getRandom("mp4")
    var out = getRandom("mp3")
    await simpan(".tmp/" + filename, buffer)
    var outname = cp.execSync(`ffmpeg -i ${".tmp/"+filename} ${".tmp/"+out}`)
    return baca(".tmp/" + out)
}
async function toImage(buffer) {
    var filename = getRandom("webp")
    var out = getRandom("png")
    await simpan(".tmp/" + filename, buffer)
    var outname = cp.execSync(`ffmpeg -i ${".tmp/"+filename} ${".tmp/"+out}`)
    return baca(".tmp/" + out)
}
function getRandom(ext) {
    ext = ext || ""
    return `${Math.floor(Math.random() * 100000)}.${ext}`
}
 function hapus(path) {
    fs.unlinkSync(path)
    return path
}
 function baca(path) {
    return fs.readFileSync(path)
}
 function simpan(path, buff) {
    fs.writeFileSync(path, buff)
    return path
}

async function telegra(buffer) {
    var ftp = await (await import("file-type")).fileTypeFromBuffer(buffer)
    let file = Buffer.isBuffer(buffer) ? simpan(".tmp/" + getRandom(ftp.ext), buffer) : buffer
    let form = new FormData
    form.append("file", fs.createReadStream(file), "kontol.jpg")
    let res = await (await fetch("https://telegra.ph/upload", {
        method: "POST",
        body: form
    })).json()
    return "https://telegra.ph" + res[0].src
}
async function anonfile(buffer) {
var { ext } = await (await import("file-type")).fileTypeFromBuffer(buffer)
var suk = simpan(".tmp/" + getRandom(ext), buffer)
var curl = cp.execSync(`curl -F "file=@${suk}" https://api.anonfiles.com/upload`).toString()
return JSON.parse(util.format(curl)).data.file
}
async function capcutdl(Url) {
  try {
    let { request } = await axios.get(Url);
    let res = request.res.responseUrl;
    let token = res.match(/\d+/)[0];
    const { data } = await axios({
      url: `https://ssscap.net/api/download/${token}`,
      method: 'GET',
      headers: {
        'Cookie': 'sign=2cbe441f7f5f4bdb8e99907172f65a42; device-time=1685437999515'
      }
    });    
return data
  } catch (error) {
    console.log(error);
  }
}

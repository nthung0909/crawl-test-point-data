const axios = require("axios");
const fs = require("fs");
const cities = {
  // "Sở GDĐT Quảng Bình": "31000001",
  // "Sở GDĐT Quảng Trị": "32000001",
  // "Sở GDĐT Thừa Thiên -Huế": "33000001",
  // "Sở GDĐT Quảng Nam": "34000001",
  // "Sở GDĐT Quảng Ngãi": "35000001",
  // "Sở GDĐT Kon Tum": "36000001",
  // "Sở GDĐT Bình Định": "37000001",
  // "Sở GDĐT Gia Lai": "38000001",
  // "Sở GDĐT Phú Yên": "39000001",
  // "Sở GDĐT Đắk Lắk": "40000001",
  // "Sở GDĐT Khánh Hoà": "41000001",
  // "Sở GDĐT Lâm Đồng": "42000001",
  // "Sở GDĐT Bình Phước": "43000001",
  // "Sở GDĐT Bình Dương": "44000001",
  // "Sở GDĐT Ninh Thuận": "45000001",
  // "Sở GDĐT Tây Ninh": "46000001",
  // "Sở GDĐT Bình Thuận": "47000001",
  // "Sở GDĐT Đồng Nai": "48000001",
  // "Sở GDĐT Long An": "49000001",
  // "Sở GDĐT Đồng Tháp": "50000001",
  // "Sở GDĐT An Giang": "51000001",
  "Sở GDĐT Bà Rịa-Vũng Tàu": "52000001",
  "Sở GDĐT Tiền Giang": "53000001",
  "Sở GDĐT Kiên Giang": "54000001",
  "Sở GDĐT Cần Thơ": "55000001",
  "Sở GDĐT Bến Tre": "56000001",
  "Sở GDĐT Vĩnh Long": "57000001",
  "Sở GDĐT Trà Vinh": "58000001",
  "Sở GDĐT Sóc Trăng": "59000001",
  "Sở GDĐT Bạc Liêu": "60000001",
  "Sở GDĐT Cà Mau": "61000001",
  "Sở GDĐT Đăk Nông": "63000001",
  "Sở GDĐT Hậu Giang": "64000001",
  "Sở GDĐT Đà Nẵng": "04000001",
  "Sở GDĐT TP. Hồ Chí Minh": "02000001",
};
const jsdom = require("jsdom");

const axiosHeader = {
  authority: "vietnamnet.vn",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
  cookie:
    '__zi=3000.SSZzejyD3jSkdkMgrnS5mcs6xlpLGnkCOvwjeCT919uXZBksX1P2coJ9zxw764UHRyxqkiCVGf5bol2qCpa.1; __utmc=103009543; __utmz=103009543.1689970156.4.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _gid=GA1.2.1331095593.1689970157; _clck=1jfgx3u|2|fdh|0|1284; _clsk=wycjzg|1689970241869|2|0|w.clarity.ms/collect; VNNCLI=2630910931; __utma=103009543.2111265321.1688836555.1689970156.1690008191.5; __utmt=1; __utmb=103009543.2.10.1690008191; _ga_3ESSCD5TRX=GS1.1.1690008191.6.1.1690008209.42.0.0; vadsft.013a7eea1a43e186867c56d11a7124cc3b55cf8230=0; _ga_DB7FXDGNRF=GS1.1.1690008191.6.1.1690008209.42.0.0; _ga=GA1.1.57870041.1688837822; g_state={"i_p":1690094650144,"i_l":2}; _ga_E8SM6C8V2E=GS1.1.1690008191.6.1.1690008252.60.0.0; _ga_H09ZVYLY1C=GS1.1.1690008191.6.1.1690008252.0.0.0; _ga_SZMJF489RJ=GS1.1.1690008191.6.1.1690008252.0.0.0',
  "if-none-match": 'W/"133344600829476731"',
  referer:
    "https://vietnamnet.vn/giao-duc/diem-thi/tra-cuu-diem-thi-tot-nghiep-thpt/2022/02043148.html",
  "sec-ch-ua":
    '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
};

async function getScoreDataByCity() {
  for (const city in cities) {
    const firstId = cities[city];
    const baseId = Number(firstId.slice(0, 2));
    const scores = [];
    let total = 0;
    let errorTimes = 0;
    for (let range = 0; range < 206; range++) {
      const promises = [];
      for (let i = 0; i < 500; i++) {
        let id = baseId * 1000000 + range * 500 + i + 1;
        id = baseId < 10 ? `0${id}` : id.toString();
        console.log(id);

        promises.push(
          axios
            .get(
              `https://vietnamnet.vn/giao-duc/diem-thi/tra-cuu-diem-thi-tot-nghiep-thpt/2022/${id}.html`,
              {
                headers: axiosHeader,
              }
            )
            .catch((err) => {
              console.log(err?.stack);
              errorTimes++;
            })
        );
      }
      const data = await Promise.all(promises);
      for (const scoreInfo of data) {
        if (!scoreInfo?.data) continue;

        const dom = new jsdom.JSDOM(scoreInfo.data);
        const data = dom.window.document.querySelector(
          ".resultSearch__right > table > tbody"
        );

        let A00_score = 0;
        let flag = 0;
        if (data.childNodes.length) {
          for (const node of data.childNodes) {
            if (!node.textContent) continue;
            const regex = /\n/gi;
            if (node.textContent.includes("Toán")) {
              const mathScore = Number(
                node.textContent
                  .trim()
                  .replace(regex, "")
                  .split("Toán")[1]
                  .trim()
              );
              if (!mathScore) break;
              flag++;
              A00_score += mathScore;
            } else if (node.textContent.includes("Lí")) {
              const phyScore = Number(
                node.textContent.trim().replace(regex, "").split("Lí")[1].trim()
              );
              if (!phyScore) break;
              flag++;
              A00_score += phyScore;
            } else if (node.textContent.includes("Hóa")) {
              const bioScore = Number(
                node.textContent
                  .trim()
                  .replace(regex, "")
                  .split("Hóa")[1]
                  .trim()
              );
              if (!bioScore) break;
              flag++;
              A00_score += bioScore;
            }
          }
        }
        if (A00_score && flag === 3) {
          errorTimes = 0;
          scores.push(A00_score);
          total += 1;
        }
      }
      if (errorTimes > 400) break;
    }
    fs.writeFileSync(
      `data_2022/mien_nam/${city}.json`,
      JSON.stringify({ scores, total }),
      {}
    );
  }
}

getScoreDataByCity()
  .then(() => {
    console.log("DONE!!!!");
  })
  .catch((err) => {
    console.log(err?.stack);
  });

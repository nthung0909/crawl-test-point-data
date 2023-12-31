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
  // "Sở GDĐT Bà Rịa-Vũng Tàu": "52000001",
  // "Sở GDĐT Tiền Giang": "53000001",
  // "Sở GDĐT Kiên Giang": "54000001",
  // "Sở GDĐT Cần Thơ": "55000001",
  // "Sở GDĐT Bến Tre": "56000001",
  // "Sở GDĐT Vĩnh Long": "57000001",
  // "Sở GDĐT Trà Vinh": "58000001",
  // "Sở GDĐT Sóc Trăng": "59000001",
  // "Sở GDĐT Bạc Liêu": "60000001",
  // "Sở GDĐT Cà Mau": "61000001",
  // "Sở GDĐT Đăk Nông": "63000001",
  // "Sở GDĐT Hậu Giang": "64000001",
  // "Sở GDĐT Đà Nẵng": "04000001",
  "Sở GDĐT TP. Hồ Chí Minh": "02000001",
};

const axiosHeader = {
  authority: "api-university-2022.beecost.vn",
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
  origin: "https://diemthi.beecost.vn",
  referer: "https://diemthi.beecost.vn/",
  "sec-ch-ua":
    '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
};

async function getFirstIdOfCity() {
  const cityInfo = {};
  for (let i = 1; i < 100; i++) {
    const id = `${i < 10 ? `0${i}` : `${i}`}000001`;
    try {
      const data = await axios.get(
        "https://api-university-2022.beecost.vn/university/lookup_examiner",
        {
          params: {
            id,
          },
          headers: axiosHeader,
        }
      );
      if (data?.data?.status === "success") {
        cityInfo[data.data.data.test_location] = id;
      }
    } catch (err) {
      continue;
    }
  }
  fs.writeFileSync("city.json", JSON.stringify(cityInfo), {});
}

async function getScoreDataByCity() {
  for (const city in cities) {
    const firstId = cities[city];
    const baseId = Number(firstId.slice(0, 2));
    const scores = [];
    let total = 0;
    let errorTimes = 0;
    for (let range = 0; range < 93; range++) {
      const promises = [];
      for (let i = 0; i < 1000; i++) {
        let id = baseId * 1000000 + range * 1000 + i + 1;
        id = baseId < 10 ? `0${id}` : id.toString();

        promises.push(
          axios
            .get(
              "https://api-university-2022.beecost.vn/university/lookup_examiner",
              {
                params: {
                  id,
                },
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
        if (
          scoreInfo?.data?.status === "success" &&
          scoreInfo?.data?.data?.scores?.subject_group_score.A00
        ) {
          errorTimes = 0;
          scores.push(scoreInfo.data.data.scores.subject_group_score.A00);
          total += 1;
        }
      }
      if (errorTimes > 400) break;
    }
    fs.writeFileSync(
      `data_2023/mien_nam/${city}.json`,
      JSON.stringify({ scores, total }),
    );
  }
}

// getFirstIdOfCity()
//   .then((resp) => {
//     console.log("Done!!!");
//   })
//   .catch((err) => {
//     console.log(err?.stack);
//   });

getScoreDataByCity()
  .then((resp) => {
    console.log("DONE!!!!");
  })
  .catch((err) => {
    console.log(err?.stack);
  });

const axios = require("axios");
const fs = require("fs");
const cities = require('./city.json');

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
    for (let range = 0; range < 184; range++) {
      const promises = [];
      for (let i = 0; i < 500; i++) {
        let id = baseId * 1000000 + range * 500 + i + 1;
        id = baseId < 10 ? `0${id}` : id.toString();
        console.log(id);

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
        }
      }
      total += (data || []).filter((item) => !!item).length;
      if (errorTimes > 400) break;
    }
    fs.writeFileSync(
      `data_2023/mien_bac/${city}.json`,
      JSON.stringify({ scores, total: total - 1 }),
      {}
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

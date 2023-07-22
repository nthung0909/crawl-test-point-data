const fs = require("fs");

const countNumberOfStudent = (folder) => {
    let total = 0;
    fs.readdirSync(folder).forEach(file => {
        const dataOfCity = fs.readFileSync(`${folder}/${file}`);
        total += JSON.parse(dataOfCity).scores.length;
      });
    return total;
}

const countHigherScore = (folder, score) => {
    let total = 0;
    fs.readdirSync(folder).forEach(file => {
        const dataOfCity = fs.readFileSync(`${folder}/${file}`);
        const scores = JSON.parse(dataOfCity)?.scores || [];
        if(scores.length) {
            total += scores.filter(item => item >= score).length;
        }
      });
    return total;
}

const countJoin2023 = countNumberOfStudent("./data_2023/mien_nam");
const countJoin2022 = countNumberOfStudent("./data_2022/mien_nam");
const thiSinhDiemCaoHon2023 = countHigherScore("./data_2023/mien_nam", 25.4);
console.log("countJoin2023: ", countJoin2023);
console.log("countJoin2022: ", countJoin2022);
console.log("thiSinhDiemCaoHon2023: ", thiSinhDiemCaoHon2023);

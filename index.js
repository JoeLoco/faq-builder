const fileGetContents = require('file-get-contents');
const fs = require('fs').promises;
// A File request

const faq = {
    sections: []
}

let currentSection = null;
let currentQuestion = null;

const run = async ()=>{
    const data = await fileGetContents('./faq.md');
    data.split("\r\n").forEach((line) => {
       
        if(line.match(/^# (.*$)/gim)) {
            currentSection = {
                title: line.replace(/^# (.*$)/gim,"$1").trim(),
                questions: []
            };
            faq.sections.push(currentSection);
            return;
        }

        if(line.match(/^## (.*$)/gim)) {
            currentQuestion = {
                question: line.replace(/^## (.*$)/gim,"$1").trim(),
                answer: ""
            }
            currentSection.questions.push(currentQuestion);
            return;
        }

        if(currentQuestion !== null) {
            currentQuestion.answer += `${line}\r\n`;
            return;
        }

    });

    await fs.writeFile("./faq.json", JSON.stringify(faq));

    console.log("faq.json was generated!");
};

run();
const quizData = [
    {
        question: "　　",
        calculations: `南に10km東に10km北に10km移動したら
        元いた場所に着きました 
これはありえるでしょうか？
`,
        answers: ["ありえます", "ありえません"],
        correct: 0  // 正しい答えは "ありえます"
    },
    {
        question: "2進数を知ろう。 1011を数字にすると？",
        calculations: `
        ヒント：1から２になったら１ケタ繰り上がる。2の場合は、10)
`,
        answers: ["9", "10", "11" , "12" ,"13","14"],
        correct: 2 // 正しい答えは "A.２"
    },
];

let currentQuestionIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadStartScreen();
});

function loadStartScreen() {
    const startScreen = document.getElementById('startScreen');
    const curtain = document.createElement('div');
    curtain.classList.add('curtain');
    document.body.appendChild(curtain);

    setTimeout(() => {
        curtain.remove();
        startScreen.style.display = 'block';
    }, 500);
}

document.getElementById('startButton').onclick = () => {
    const startScreen = document.getElementById('startScreen');
    const curtain = document.createElement('div');
    curtain.classList.add('curtain');
    document.body.appendChild(curtain);

    setTimeout(() => {
        startScreen.style.display = 'none';
        curtain.remove();
        document.getElementById('quiz').style.display = 'block';
        loadQuestion();
    }, 500);
};

function loadQuestion() {
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';

    const currentQuestion = quizData[currentQuestionIndex];

    const questionElement = document.createElement('h2');
    questionElement.classList.add('question', 'fade-in');
    questionElement.textContent = currentQuestion.question;
    quizContainer.appendChild(questionElement);

    const calculationsElement = document.createElement('pre');
    calculationsElement.textContent = currentQuestion.calculations;
    calculationsElement.style.fontSize = '24px';
    calculationsElement.style.fontWeight = 'bold';
    calculationsElement.style.margin = '20px 0';
    calculationsElement.style.textAlign = 'center';
    calculationsElement.style.textShadow = "1px 1px 5px rgba(0, 0, 0, 0.5)";
    quizContainer.appendChild(calculationsElement);

    const answersContainer = document.createElement('div');
    answersContainer.classList.add('answers');

    currentQuestion.answers.forEach((answer, index) => {
        const answerButton = document.createElement('div');
        answerButton.textContent = answer;
        answerButton.classList.add('answer');
        answerButton.onclick = () => selectAnswer(index);

        answerButton.onmouseenter = () => {
            answerButton.classList.add('hover');
        };
        answerButton.onmouseleave = () => {
            answerButton.classList.remove('hover');
        };

        answersContainer.appendChild(answerButton);
    });

    quizContainer.appendChild(answersContainer);

    // メッセージ要素を追加（1問目のみ）
    if (currentQuestionIndex === 0) {
        const messageElement = document.createElement('h2');
        messageElement.id = 'northPoleMessage';
        messageElement.textContent = "北極点からスタートするとできます。";
        messageElement.style.color = "white";
        messageElement.style.fontSize = "24px";
        messageElement.style.fontWeight = "bold";
        messageElement.style.fontFamily = "Lato"; // Latoフォントを指定
        messageElement.style.textAlign = "center";
        messageElement.style.display = "none"; // 初期は非表示
        quizContainer.appendChild(messageElement);
    }

    setTimeout(() => {
        questionElement.classList.add('show');
    }, 10);
}

function selectAnswer(index) {
    const currentQuestion = quizData[currentQuestionIndex];
    const answerElements = document.querySelectorAll('.answer');

    answerElements.forEach((element, i) => {
        if (i === currentQuestion.correct) {
            element.classList.add('correct');
            element.classList.add('show-correct');
        } else {
            element.classList.add('wrong');
            element.classList.add('shake');
        }
        element.onclick = null; // クリックを無効化
    });

    if (index === currentQuestion.correct) {
        score++;
    }

    // メッセージのフェードイン（1問目のみ）
    if (currentQuestionIndex === 0) {
        const messageElement = document.getElementById('northPoleMessage');
        messageElement.style.display = 'block'; // メッセージを表示
        messageElement.style.opacity = 0; // 初期透明度
        messageElement.style.transition = "opacity 0.5s"; // フェードインのトランジション
        setTimeout(() => {
            messageElement.style.opacity = 1; // フェードイン
        }, 100);
    }

    // 正解の選択肢を中央に大きく表示
    const correctElement = answerElements[currentQuestion.correct];
    correctElement.classList.add('show-correct');

    setTimeout(() => {
        correctElement.classList.remove('show-correct');
    }, 1000);

    document.getElementById('next').style.display = 'block';
}

document.getElementById('next').onclick = () => {
    const totalQuestions = quizData.length;

    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        loadQuestion();
        document.getElementById('next').style.display = 'none';

        // メッセージを非表示にする（2問目に進むとき）
        if (currentQuestionIndex === 1) {
            const messageElement = document.getElementById('northPoleMessage');
            messageElement.style.display = 'none';
        }
    } else {
        const curtain = document.createElement('div');
        curtain.classList.add('curtain');
        document.body.appendChild(curtain);

        setTimeout(() => {
            curtain.style.animation = 'curtainDown 0.5s forwards';
            document.body.style.backgroundColor = 'black';

            // スコアをチェック
            if (score === totalQuestions) {
                playSound('correctSound'); // 満点の音
                showMessage("やったね👍→右に行ってね。", "white");
            } else if (score === 0) {
                playSound('wrongSound'); // 不正解の音
                showMessage("お疲れ様👍↑前に行ってね", "white", true);
            } else {
                playSound('correctSound'); // 1/2正解の音
                showMessage("やったね👍→右に行ってね", "white");
            }
        }, 500);
    }
};

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // 再生位置を先頭に戻す
    sound.play();
}

function showMessage(message, color, isWrong = false) {
    const messageElement = document.createElement('h2');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.style.textShadow = "1px 1px 5px rgba(255, 255, 255, 0.5)";
    messageElement.style.position = "fixed";
    messageElement.style.top = "50%";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translate(-50%, -50%)";
    messageElement.style.fontSize = "50px";
    messageElement.style.opacity = 0;
    messageElement.style.transition = "opacity 0.5s";
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.style.opacity = 1;
    }, 100);

    setTimeout(() => {
        messageElement.style.opacity = 0;
        setTimeout(() => {
            messageElement.remove();
            fadeOutBackgroundAndRedirect();
        }, 500);
    }, 5000);
}

function fadeOutBackgroundAndRedirect() {
    const curtain = document.createElement('div');
    curtain.classList.add('curtain');
    document.body.appendChild(curtain);

    document.body.style.transition = "opacity 1s";
    document.body.style.opacity = 0;

    setTimeout(() => {
        window.location.href = "https://astonishing-monstera-ebc27a.netlify.app/";
    }, 1000);
}

// 背景画像の設定
document.body.style.backgroundImage = "url('background.jpg')";
document.body.style.backgroundSize = "cover";

// 音声ファイルの設定
const audioElements = `
<audio id="correctSound" src="mac.wav"></audio>
<audio id="wrongSound" src="xx.wav"></audio>
`;
document.body.insertAdjacentHTML('beforeend', audioElements);

// 初期クイズをロード
loadQuestion();

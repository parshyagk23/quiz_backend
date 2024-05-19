const quiz = require("./../Models/Quiz");
const verifyToken = require("./../Middlewares/VerifyToken");

const PostQuiz = async (req, res) => {
  try {
    const {
      QuizName,
      QuizType,
      Questions,
      Impressions,
      AttemptedQuestion,
      CorrectAns,
    } = req.body;
    const token = req.headers["authorization"];
    const userId = verifyToken.decodeToken(token);
    if (!QuizName || !QuizType) {
      return res.status(400).json({ errormessage: "Bad request" });
    }
    Questions.map((data) => {
      const { Question, OptionType, Options, timer } = data;
      if (!Question || !OptionType) {
        return res.status(400).json({ errormessage: "Bad request" });
      }

      let isError = false;
      Options.map((data) => {
        const { text, imageUrl, isCorrectAns, PollCount } = data;
        if (OptionType === "Q&A") {
          if (OptionType === "text") {
            if (text === "" || isCorrectAns == undefined) {
              isError = true;
              return;
            }
          } else if (OptionType === "imageUrl") {
            if (imageUrl === "" || isCorrectAns == undefined) {
              isError = true;
              return;
            }
          } else if (OptionType === "textimageUrl") {
            if (text === "" || imageUrl === "" || isCorrectAns == undefined) {
              isError = true;
              return;
            }
          }
        } else {
          if (OptionType === "text") {
            if (text === "") {
              isError = true;
              return;
            }
          } else if (OptionType === "imageUrl") {
            if (imageUrl === "") {
              isError = true;
              return;
            }
          } else if (OptionType === "textimageUrl") {
            if (text === "" || imageUrl === "") {
              isError = true;
              return;
            }
          }
        }
        if (isError) {
          return res.status(400).json({ errormessage: "Bad request" });
        }
      });
    });

    const CreateQuiz = await new quiz({
      QuizName,
      QuizType,
      userId,
      Questions,
      Impressions,
      AttemptedQuestion,
      CorrectAns,
    });
    await CreateQuiz.save();

    return res.status(200).json({
      message: "Quiz create successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const GetQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ errormessage: "Bad request" });
    }
    const GetQuizById = await quiz.findOne({ _id: id });
    if (!GetQuizById) {
      return res.status(401).json({ errormessage: "Data not found" });
    }
    GetQuizById.Impressions = GetQuizById.Impressions + 1;
    await GetQuizById.save();
    return res.status(200).json({ data: GetQuizById });
  } catch (error) {
    console.log(error);
  }
};

const GetQuizByUserId = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userId = verifyToken.decodeToken(token);

    if (!userId) {
      return res.status(400).json({ errormessage: "Bad request" });
    }
    const QuizByUserId = await quiz.find({ userId });
    if (!QuizByUserId) {
      return res.status(401).json({ errormessage: "Data not found" });
    }

    return res.status(200).json({ data: QuizByUserId });
  } catch (error) {
    console.log(error);
  }
};

const isCorrectQuizAns = async (req, res) => {
  try {
    let { quizid, questionindex, optionindex } = req.params;
    if (!quizid || !questionindex || !optionindex) {
      return res.status(400).json({ errormessage: "Bad request" });
    }
    const QuizById = await quiz.findOne({ _id: quizid });
    if (!QuizById) {
      return res.status(401).json({ errormessage: "Data not found" });
    }

    questionindex = Number(questionindex);
    optionindex = Number(optionindex);
    
    const question = QuizById?.Questions?.[questionindex];
    const option = question?.Options?.[optionindex];
    if (!question || !option) {
      return res.status(400).json({ errormessage: "Invalid question or option index" });
    }
    if (QuizById.QuizType === "Q&A") {
      const isCorrectQuizAns = option?.isCorrectAns;
      QuizById.AttemptedQuestion = (QuizById?.AttemptedQuestion || 0) + 1;

    
      if (isCorrectQuizAns) {
        QuizById.CorrectAns = (QuizById?.CorrectAns || 0) + 1;
      }
      await QuizById.save();
      return res.status(200).json({ QuizAns: isCorrectQuizAns });
    }
    option.PollCount = (option?.PollCount || 0) + 1;
    await QuizById.save();
    return res.status(200).json({ PollCount: option.PollCount });         
  } catch (error) {
    console.log(error);
  }
};

const DeleteQuizById = async (req, res) => {
  try {
    let { id} = req.params;
    if (!id) {
      return res.status(400).json({ errormessage: "Bad request" });
    }
    const QuizById = await quiz.findByIdAndDelete({ _id: id });
    if (!QuizById) {
      return res.status(401).json({ errormessage: "Data not found" });
    }

    
    return res.status(200).json({message:'Quiz Deleted Successfully'});         
  } catch (error) {
    console.log(error);
  }
};

module.exports = { PostQuiz, GetQuiz, GetQuizByUserId, isCorrectQuizAns,DeleteQuizById };

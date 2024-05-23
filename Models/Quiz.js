const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema(

    {
        QuizName:{
            type:String,
            require:true,
        },
        QuizType:{
            type:String,
            require:true,
        },
        userId:{
            type:String,
            require:true,
        },
        QuizId:{
            type:String,
            require:true,
        },
        Questions:[
        {
            Question:{
                type:String,
                require:true
            },
            OptionType:{
                type:String,
                require:true
            },
            timer:{
                type:Number
            },
            Options:[
                {
                    text:{
                        type:String,
                        require:true
                    },
                    imageUrl:{
                        type:String,
                        require:true
                    },
                    isCorrectAns:{
                        type:Boolean,
                    },
                    PollCount:{
                        type:Number,
                    }
                }
            ],
           
        }
        
        ],
        Impressions:{
            type:Number,
        },
        AttemptedQuestion:{
            type:Number,
        },
        CorrectAns:{
            type:Number,
        }
        
    },
    {timestamps:{createdAt:'createdAt' , updatedAt:'UpdatedAt'}}
)

module.exports = mongoose.model("quiz",quizSchema);
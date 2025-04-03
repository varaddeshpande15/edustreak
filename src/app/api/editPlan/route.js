import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";

// Path to the saved study plan JSON
const studyPlanPath = path.join(process.cwd(), "public", "studyPlan.json");

// Gemini API Key (Replace with your actual API Key)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Load the current study plan
const loadStudyPlan = () => {
  if (fs.existsSync(studyPlanPath)) {
    const rawData = fs.readFileSync(studyPlanPath, "utf8");
    return JSON.parse(rawData);
  }
  return null;
};

// Save the modified study plan
const saveStudyPlan = (updatedPlan) => {
  fs.writeFileSync(studyPlanPath, JSON.stringify(updatedPlan, null, 2), "utf8");
};

export async function POST(req) {
  try {
    const { userMessage } = await req.json();
    const studyPlan = loadStudyPlan();

    if (!studyPlan) {
      return NextResponse.json({ error: "Study plan not found." }, { status: 404 });
    }

    // Send request to Gemini API
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const geminiResponse = await axios.post(
  `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,  // Use correct URL format
  {
    contents: [{ role: "user", parts: [{ text: `Modify this study plan and give the modified plan in JSON format strictly, the json format should be same as the current plan json format which looks like this "{
  "playlist": "Machine Learning Playlist",
  "total_videos": 38,
  "total_minutes": 1067,
  "daily_study_time": 120,
  "deadline": "2025-03-31",
  "start_date": "2025-03-22",
  "days_required": 9,
  "daily_schedule": [
    {
      "day": 1,
      "date": "2025-03-22",
      "videos": [
        {
          "title": "Introduction To Machine Learning Algorithms In Hindi",
          "videoId": "7uwa9aPbBRU",
          "duration": 19,
          "completed": false,
          "notes": "Overview of different ML algorithms. Understanding supervised, unsupervised, and reinforcement learning.  Different types of ML problems and their applications."
        },
        {
          "title": "Simple Linear Regression Algorithm Indepth Maths Intuition With Notes In Hindi",
          "videoId": "jerPVDaHbEA",
          "duration": 52,
          "completed": false,
          "notes": "In-depth mathematical understanding of Simple Linear Regression.  Derivation of the cost function and its optimization using gradient descent. Importance of understanding the assumptions of Linear Regression."
        },
        {
          "title": "Linear Regression Practical Implementation In Hindi",
          "videoId": "bRl2IXIjuqE",
          "duration": 24,
          "completed": false,
          "notes": "Practical implementation of Linear Regression using Python. Data preprocessing steps. Model training and evaluation using metrics like R-squared."
        },
        {
          "title": "Mean Sqaured Error, Mean Absolute Error And RMSE In Hindi- Linear Regression | Krish Naik Hindi",
          "videoId": "KUrm-F8mXJQ",
          "duration": 12,
          "completed": false,
          "notes": "Understanding different evaluation metrics for Linear Regression. MSE, MAE, and RMSE and their interpretations. When to use each metric."
        }
      ],
      "total_minutes": 107,
      "notes": "Focus: Understanding the fundamentals of Machine Learning and diving deep into Linear Regression (theory, implementation, and evaluation). Revise the gradient descent algorithm."
    },
    {
      "day": 2,
      "date": "2025-03-23",
      "videos": [
        {
          "title": "Ridge And Lasso Regression Indepth Maths Intuition In hindi",
          "videoId": "KapPZCurdsQ",
          "duration": 18,
          "completed": false,
          "notes": "In-depth mathematical intuition behind Ridge and Lasso Regression. Understanding L1 and L2 regularization. How regularization helps prevent overfitting."
        },
        {
          "title": "Ridge And Lasso Practical Implementation In Hindi",
          "videoId": "J_ESMRGpl74",
          "duration": 15,
          "completed": false,
          "notes": "Practical implementation of Ridge and Lasso Regression in Python. Tuning the regularization parameter (alpha). Comparing the performance of Ridge, Lasso, and Linear Regression."
        },
        {
          "title": "ElasticNet Regression Machine Learning Algorithm Explained In Hindi",
          "videoId": "PbK8Hm13Baw",
          "duration": 19,
          "completed": false,
          "notes": "Understanding ElasticNet Regression, a combination of L1 and L2 regularization. Choosing the appropriate L1 ratio. Advantages of ElasticNet over Ridge and Lasso."
        },
        {
          "title": "Logistic Regression Indepth Maths Intuition In Hindi",
          "videoId": "_nvQKN8L1ZE",
          "duration": 30,
          "completed": false,
          "notes": "In-depth mathematical intuition behind Logistic Regression. Understanding the sigmoid function and its role in classification. Cost function and its optimization for Logistic Regression."
        },
        {
          "title": "Logistic Regression Practical Implementation In Python|Krish Naik|Hindi",
          "videoId": "n40hS9tQmcY",
          "duration": 20,
          "completed": false,
          "notes": "Practical implementation of Logistic Regression using Python. Data preprocessing for classification problems. Model training and evaluation using metrics like accuracy, precision, and recall."
        }
      ],
      "total_minutes": 102,
      "notes": "Focus: Learning about regularization techniques (Ridge, Lasso, ElasticNet) and transitioning to classification with Logistic Regression. Revise L1 and L2 norms."
    },
    {
      "day": 3,
      "date": "2025-03-24",
      "videos": [
        {
          "title": "Hindi-Naive Baye's Machine Learning Algorithm Indepth Inution- Part 1",
          "videoId": "7zpEuCTcdKk",
          "duration": 14,
          "completed": false,
          "notes": "Understanding the fundamentals of Naive Bayes algorithm. Bayes' theorem and its application in classification. The 'naive' assumption of feature independence."
        },
        {
          "title": "Hindi-Naive Baye's Machine Learning Algorithm Indepth Inution- Part 2",
          "videoId": "VIj6xS937E4",
          "duration": 25,
          "completed": false,
          "notes": "Different types of Naive Bayes classifiers (Gaussian, Multinomial, Bernoulli). Understanding the probability distributions used in each type. Applications of Naive Bayes."
        },
        {
          "title": "Hindi-K Nearest Neighbour Indepth Intuition- Classification And Regression",
          "videoId": "gU6KTNbk0hk",
          "duration": 17,
          "completed": false,
          "notes": "In-depth intuition behind the K-Nearest Neighbors (KNN) algorithm. KNN for classification and regression. Choosing the optimal value of K. Distance metrics used in KNN."
        },
        {
          "title": "Hindi- Overfitting, Underfitting,Bias And Variance Explained In Hindi| Machine Learning",
          "videoId": "m5E6QxKFYlM",
          "duration": 12,
          "completed": false,
          "notes": "Understanding the concepts of overfitting, underfitting, bias, and variance. How these concepts affect model performance. Techniques to address overfitting and underfitting."
        },
        {
          "title": "Performance Metrics, Accuracy,Precision,Recall And F-Beta Score Explained In Hindi|Machine Learning",
          "videoId": "5vqk6HnITko",
          "duration": 24,
          "completed": false,
          "notes": "Comprehensive explanation of performance metrics for classification problems. Accuracy, precision, recall, F1-score, and F-beta score. Understanding the trade-off between precision and recall. Confusion matrix."
        }
      ],
      "total_minutes": 92,
      "notes": "Focus: Exploring classification algorithms like Naive Bayes and KNN. Understanding the important concepts of overfitting, underfitting, and performance metrics. Revise Bayes Theorem."
    },
    {
      "day": 4,
      "date": "2025-03-25",
      "videos": [
        {
          "title": "Support Vector Machine Classifier Indepth Intution In Hindi| Krish Naik",
          "videoId": "9iD8DMF6odw",
          "duration": 25,
          "completed": false,
          "notes": "In-depth intuition behind Support Vector Machines (SVM) for classification. Understanding the concept of hyperplanes and support vectors. Maximizing the margin."
        },
        {
          "title": "Support Vector Regression Indepth Maths Intuition In Hindi",
          "videoId": "SBDO31GjNjg",
          "duration": 11,
          "completed": false,
          "notes": "Understanding Support Vector Regression (SVR). How SVR differs from SVM for classification. Epsilon-insensitive loss function."
        },
        {
          "title": "How SVM Kernels Work? |Krish Naik Hindi",
          "videoId": "sRdquT--KO8",
          "duration": 10,
          "completed": false,
          "notes": "Understanding different types of SVM kernels (linear, polynomial, RBF). How kernels map data to higher dimensions. Choosing the appropriate kernel for a given problem."
        },
        {
          "title": "Part 1-Decision Tree Classifier Indepth Intuition In Hindi| Krish Naik",
          "videoId": "ynTCUngbFHA",
          "duration": 34,
          "completed": false,
          "notes": "In-depth intuition behind Decision Tree Classifiers. How decision trees work. Information gain and Gini impurity. Building a decision tree."
        },
        {
          "title": "Part 2-Post Prunning And Pre Prunning In Decision Tree Classifier In Hindi| Krish Naik",
          "videoId": "gcF4wppbDuA",
          "duration": 10,
          "completed": false,
          "notes": "Understanding pre-pruning and post-pruning techniques to prevent overfitting in decision trees. Cost complexity pruning."
        }
      ],
      "total_minutes": 90,
      "notes": "Focus: Learning about Support Vector Machines (SVM) and Decision Trees. Understanding the mathematical concepts behind SVM and the different types of kernels. Revise hyperplanes and margin maximization."
    },
    {
      "day": 5,
      "date": "2025-03-26",
      "videos": [
        {
          "title": "Part 3- Decision Tree And Post Prunning Practical Implementation In Hindi | Krish Naik",
          "videoId": "OMFQvcBx-Fc",
          "duration": 16,
          "completed": false,
          "notes": "Practical implementation of Decision Trees with post-pruning using Python."
        },
        {
          "title": "Part 4-Hindi- Decision Tree And Pre Prunning Practical Implementation|Krish Naik",
          "videoId": "mXcPVtbB9pU",
          "duration": 14,
          "completed": false,
          "notes": "Practical implementation of Decision Trees with pre-pruning using Python."
        },
        {
          "title": "Part 5-Hindi- Decision Tree Regression Indepth Intuition With Variance Reduction|Krish Naik",
          "videoId": "uHq0I_MDVZU",
          "duration": 24,
          "completed": false,
          "notes": "Understanding Decision Tree Regression. Variance reduction and its role in building decision trees for regression problems."
        },
        {
          "title": "Training Data Vs Test Data Vs Validation Data| Krish Naik",
          "videoId": "XCYlRBf18YI",
          "duration": 15,
          "completed": false,
          "notes": "Understanding the importance of splitting data into training, test, and validation sets. The purpose of each set. Preventing data leakage."
        },
        {
          "title": "Hindi-Cross Validation Using Python In Machine Learning|Krish Naik",
          "videoId": "ATnZmBxIvmQ",
          "duration": 13,
          "completed": false,
          "notes": "Implementing cross-validation techniques using Python. Evaluating model performance using cross-validation."
        },
        {
          "title": "Hindi-Types Of Cross Validation In Machine Learning|Krish Naik",
          "videoId": "bq4LytNAjjM",
          "duration": 19,
          "completed": false,
          "notes": "Different types of cross-validation techniques (k-fold, stratified k-fold, leave-one-out). Choosing the appropriate cross-validation technique."
        }
      ],
      "total_minutes": 101,
      "notes": "Focus: Practical implementation of Decision Trees and understanding data splitting/validation techniques. Revise pre and post pruning techniques."
    },
    {
      "day": 6,
      "date": "2025-03-27",
      "videos": [
        {
          "title": "Hindi- Ensemble Techniques-Bagging Vs Boosting|Krish Naik",
          "videoId": "5TOSlFQnnPU",
          "duration": 12,
          "completed": false,
          "notes": "Understanding Ensemble Techniques. Bagging vs. Boosting. Advantages of ensemble methods."
        },
        {
          "title": "Random Forest Regression And Classification Indepth Intuition In Hindi",
          "videoId": "WjLjjx8wSz0",
          "duration": 16,
          "completed": false,
          "notes": "In-depth intuition behind Random Forest for regression and classification. How random forests work. Feature importance in random forests."
        },
        {
          "title": "Out Of Bag(OOB) Evaluation And Error In Random Forest Indepth Intuition In Hindi",
          "videoId": "TDtP4K_2CWg",
          "duration": 7,
          "completed": false,
          "notes": "Understanding Out-of-Bag (OOB) evaluation in Random Forests. Using OOB error for model evaluation."
        },
        {
          "title": "Automated EDA Using Pandas Profiling- @krishnaikhindi",
          "videoId": "ba_8kfpWrHU",
          "duration": 7,
          "completed": false,
          "notes": "Introduction to automated EDA using Pandas Profiling. Generating reports for data exploration."
        },
        {
          "title": "Automated EDA Using Autoviz Library With 3 Lines Of Code|Krish Naik Hindi",
          "videoId": "OjHXJKTK14s",
          "duration": 9,
          "completed": false,
          "notes": "Introduction to automated EDA using Autoviz. Generating visualizations with minimal code."
        },
        {
          "title": "In-depth EDA Using SweetViz Library In 2 Lines Of Code- Krish Naik Hindi",
          "videoId": "qxmUe9LOhdQ",
          "duration": 7,
          "completed": false,
          "notes": "Introduction to automated EDA using SweetViz. Generating interactive reports for data exploration."
        },
        {
          "title": "Complete Automated EDA Using Dtale Library Ussing 3 Lines Of Code|Krish Naik Hindi",
          "videoId": "LAgR52f7Fz8",
          "duration": 10,
          "completed": false,
          "notes": "Introduction to automated EDA using Dtale. Interactive data exploration and analysis."
        },
        {
          "title": "R sqaured And Adjusted R squared Machine Learning In Hindi|Krish Naik Hindi",
          "videoId": "sk2HUh7gpZs",
          "duration": 12,
          "completed": false,
          "notes": "Understanding R-squared and Adjusted R-squared. Interpreting these metrics for model evaluation. The difference between R-squared and Adjusted R-squared."
        },
        {
          "title": "What Is Boosting Technique In Machine Learning- Krish Naik Hindi",
          "videoId": "-7mILjsok34",
          "duration": 13,
          "completed": false,
          "notes": "Introduction to boosting techniques in machine learning. How boosting algorithms work. Advantages of boosting."
        }
      ],
      "total_minutes": 93,
      "notes": "Focus: Understanding ensemble techniques, automated EDA, and model evaluation metrics. Revise Bagging vs. Boosting."
    },
    {
      "day": 7,
      "date": "2025-03-28",
      "videos": [
        {
          "title": "Adaboost ML Algorithm Indepth Intuition- Krish Naik Hindi",
          "videoId": "UgxHn8W4usI",
          "duration": 35,
          "completed": false,
          "notes": "In-depth intuition behind AdaBoost algorithm. How AdaBoost works. Assigning weights to misclassified samples."
        },
        {
          "title": "Gradient Boosting Algorithms Indepth Intuition- Krish Naik Hindi",
          "videoId": "eEtEPdw2dck",
          "duration": 18,
          "completed": false,
          "notes": "In-depth intuition behind Gradient Boosting algorithms. How gradient boosting works. Using gradient descent to minimize the loss function."
        },
        {
          "title": "Complete Unsupervised Machine Learning Tutorials In Hindi- K Means,DBSCAN, Hierarchical Clustering",
          "videoId": "Aa4MACKaDC0",
          "duration": 94,
          "completed": false,
          "notes": "Complete tutorial on unsupervised learning algorithms. K-Means clustering, DBSCAN, and Hierarchical clustering. Understanding the principles behind each algorithm. Choosing the appropriate clustering algorithm."
        }
      ],
      "total_minutes": 147,
      "notes": "Focus: Learning about boosting algorithms (AdaBoost and Gradient Boosting) and transitioning to unsupervised learning. Consider splitting this day into 2 days by removing the unsupervised learning video from the schedule."
    },
    {
      "day": 8,
      "date": "2025-03-29",
      "videos": [
        {
          "title": "Complete Anomaly Detection Machine Learning Algorithms- Isolation Forest,DBSCAN,Local Factor Outlier",
          "videoId": "93DwLV0TkNs",
          "duration": 32,
          "completed": false,
          "notes": "Complete tutorial on anomaly detection algorithms. Isolation Forest, DBSCAN, and Local Outlier Factor (LOF). Understanding the principles behind each algorithm. Choosing the appropriate anomaly detection algorithm."
        }
      ],
      "total_minutes": 32,
      "notes": "Focus: Learning about anomaly detection. "
    },
    {
      "day": 9,
      "date": "2025-03-30",
      "videos": [],
      "total_minutes": 0,
      "notes": "Focus: Revision of all key concepts. Focus on areas where understanding is weak. Review practical implementations and code examples."
    }
  ]
}" The current study plan is : ${JSON.stringify(studyPlan)}. User wants to edit the study plan with the following message: ${userMessage}` }] }],
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);
;

    const geminiData = geminiResponse.data;
    console.log("Gemini API Response:", geminiData);

    const rawText = geminiData.candidates[0].content.parts[0].text.trim();

// Try extracting JSON using regex (if Gemini wraps it in triple quotes or text)
const jsonMatch = rawText.match(/```json([\s\S]*?)```/);
const jsonString = jsonMatch ? jsonMatch[1].trim() : rawText;

const updatedPlan = JSON.parse(jsonString);

    // Save and return the modified plan
    saveStudyPlan(updatedPlan);

    return NextResponse.json({ studyPlan: updatedPlan });
  } catch (error) {
    console.error("Error editing study plan:", error);
    return NextResponse.json({ error: "Failed to edit study plan." }, { status: 500 });
  }
}

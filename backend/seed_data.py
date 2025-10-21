import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Comprehensive topics covering all 4 career paths
TOPICS_DATA = [
    # BEGINNER LEVEL
    {
        "id": str(uuid.uuid4()),
        "title": "Introduction to Data Analytics",
        "description": "Understanding data, data types, and the role of data professionals in modern organizations",
        "difficulty": "Beginner",
        "duration": "2 weeks",
        "prerequisites": [],
        "career_paths": ["Data Analyst", "Business Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "Google Data Analytics Certificate", "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "platform": "Coursera", "type": "FREE"},
            {"title": "Data Analytics for Beginners", "url": "https://www.linkedin.com/learning/data-analytics-for-beginners", "platform": "LinkedIn Learning", "type": "PAID"},
            {"title": "Introduction to Data", "url": "https://www.edx.org/learn/data-analysis", "platform": "edX", "type": "FREE"}
        ],
        "order": 1
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Python Fundamentals for Data",
        "description": "Learn Python basics, data structures, loops, functions, and libraries essential for data work",
        "difficulty": "Beginner",
        "duration": "3 weeks",
        "prerequisites": ["Introduction to Data Analytics"],
        "career_paths": ["Data Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "Python for Everybody", "url": "https://www.coursera.org/specializations/python", "platform": "Coursera", "type": "FREE"},
            {"title": "Python Basics", "url": "https://www.datacamp.com/courses/intro-to-python-for-data-science", "platform": "DataCamp", "type": "FREE"},
            {"title": "Complete Python Bootcamp", "url": "https://www.udemy.com/course/complete-python-bootcamp/", "platform": "Udemy", "type": "PAID"},
            {"title": "Learn Python - Interactive", "url": "https://www.codecademy.com/learn/learn-python-3", "platform": "Codecademy", "type": "FREE"}
        ],
        "order": 2
    },
    {
        "id": str(uuid.uuid4()),
        "title": "SQL Fundamentals",
        "description": "Master SQL queries, joins, aggregations, and database fundamentals for data retrieval and manipulation",
        "difficulty": "Beginner",
        "duration": "3 weeks",
        "prerequisites": [],
        "career_paths": ["Data Analyst", "Business Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "SQL for Data Science", "url": "https://www.coursera.org/learn/sql-for-data-science", "platform": "Coursera", "type": "FREE"},
            {"title": "SQLBolt - Interactive Tutorial", "url": "https://sqlbolt.com/", "platform": "SQLBolt", "type": "FREE"},
            {"title": "Complete SQL Bootcamp", "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/", "platform": "Udemy", "type": "PAID"},
            {"title": "SQL Practice", "url": "https://leetcode.com/problemset/database/", "platform": "LeetCode", "type": "FREE"},
            {"title": "Mode SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "platform": "Mode", "type": "FREE"}
        ],
        "order": 3
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Excel for Data Analysis",
        "description": "Advanced Excel functions, pivot tables, data visualization, and spreadsheet analysis techniques",
        "difficulty": "Beginner",
        "duration": "2 weeks",
        "prerequisites": [],
        "career_paths": ["Data Analyst", "Business Analyst"],
        "resources": [
            {"title": "Excel Skills for Business", "url": "https://www.coursera.org/specializations/excel", "platform": "Coursera", "type": "FREE"},
            {"title": "Excel Essential Training", "url": "https://www.linkedin.com/learning/excel-essential-training-office-365-microsoft-365", "platform": "LinkedIn Learning", "type": "PAID"},
            {"title": "Microsoft Excel - From Beginner to Advanced", "url": "https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/", "platform": "Udemy", "type": "PAID"}
        ],
        "order": 4
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Statistics for Data Analysis",
        "description": "Descriptive statistics, probability, distributions, hypothesis testing, and statistical inference",
        "difficulty": "Beginner",
        "duration": "4 weeks",
        "prerequisites": [],
        "career_paths": ["Data Analyst", "Business Analyst", "Data Scientist"],
        "resources": [
            {"title": "Statistics and Probability", "url": "https://www.khanacademy.org/math/statistics-probability", "platform": "Khan Academy", "type": "FREE"},
            {"title": "Statistics for Data Science", "url": "https://www.coursera.org/learn/statistical-inference", "platform": "Coursera", "type": "FREE"},
            {"title": "Practical Statistics for Data Scientists", "url": "https://www.oreilly.com/library/view/practical-statistics-for/9781492072935/", "platform": "O'Reilly", "type": "PAID"}
        ],
        "order": 5
    },
    # INTERMEDIATE LEVEL
    {
        "id": str(uuid.uuid4()),
        "title": "Pandas & NumPy for Data Manipulation",
        "description": "Master data manipulation, cleaning, transformation with Pandas and numerical computing with NumPy",
        "difficulty": "Intermediate",
        "duration": "3 weeks",
        "prerequisites": ["Python Fundamentals for Data"],
        "career_paths": ["Data Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "Data Manipulation with Pandas", "url": "https://www.datacamp.com/courses/data-manipulation-with-pandas", "platform": "DataCamp", "type": "PAID"},
            {"title": "Pandas Tutorial", "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html", "platform": "Official Docs", "type": "FREE"},
            {"title": "Python for Data Analysis", "url": "https://www.oreilly.com/library/view/python-for-data/9781491957653/", "platform": "O'Reilly", "type": "PAID"}
        ],
        "order": 6
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Data Visualization with Python",
        "description": "Create compelling visualizations using Matplotlib, Seaborn, and Plotly for data storytelling",
        "difficulty": "Intermediate",
        "duration": "3 weeks",
        "prerequisites": ["Pandas & NumPy for Data Manipulation"],
        "career_paths": ["Data Analyst", "Data Scientist"],
        "resources": [
            {"title": "Data Visualization with Python", "url": "https://www.coursera.org/learn/python-for-data-visualization", "platform": "Coursera", "type": "FREE"},
            {"title": "Data Visualization - Udemy", "url": "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/", "platform": "Udemy", "type": "PAID"},
            {"title": "Plotly Tutorial", "url": "https://plotly.com/python/", "platform": "Plotly", "type": "FREE"}
        ],
        "order": 7
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Advanced SQL & Query Optimization",
        "description": "Window functions, CTEs, subqueries, performance tuning, and advanced database concepts",
        "difficulty": "Intermediate",
        "duration": "3 weeks",
        "prerequisites": ["SQL Fundamentals"],
        "career_paths": ["Data Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "Advanced SQL", "url": "https://mode.com/sql-tutorial/sql-window-functions/", "platform": "Mode", "type": "FREE"},
            {"title": "SQL for Data Analysis", "url": "https://www.udacity.com/course/sql-for-data-analysis--ud198", "platform": "Udacity", "type": "FREE"},
            {"title": "Advanced SQL Course", "url": "https://www.linkedin.com/learning/advanced-sql-for-data-scientists", "platform": "LinkedIn Learning", "type": "PAID"}
        ],
        "order": 8
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Tableau for Business Intelligence",
        "description": "Build interactive dashboards, master Tableau Desktop, and create business intelligence reports",
        "difficulty": "Intermediate",
        "duration": "3 weeks",
        "prerequisites": ["Data Visualization with Python"],
        "career_paths": ["Data Analyst", "Business Analyst"],
        "resources": [
            {"title": "Tableau Desktop Specialist", "url": "https://www.tableau.com/learn/training", "platform": "Tableau", "type": "FREE"},
            {"title": "Tableau 2024 A-Z", "url": "https://www.udemy.com/course/tableau10/", "platform": "Udemy", "type": "PAID"},
            {"title": "Tableau Essential Training", "url": "https://www.linkedin.com/learning/tableau-essential-training-2020-1", "platform": "LinkedIn Learning", "type": "PAID"}
        ],
        "order": 9
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Power BI for Data Analytics",
        "description": "Microsoft Power BI DAX formulas, data modeling, and creating professional business dashboards",
        "difficulty": "Intermediate",
        "duration": "3 weeks",
        "prerequisites": ["Excel for Data Analysis"],
        "career_paths": ["Data Analyst", "Business Analyst"],
        "resources": [
            {"title": "Microsoft Power BI Data Analyst", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", "platform": "Microsoft Learn", "type": "FREE"},
            {"title": "Power BI A-Z", "url": "https://www.udemy.com/course/powerbi-complete-introduction/", "platform": "Udemy", "type": "PAID"},
            {"title": "Power BI Essential Training", "url": "https://www.linkedin.com/learning/power-bi-essential-training-3", "platform": "LinkedIn Learning", "type": "PAID"}
        ],
        "order": 10
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Git & Version Control",
        "description": "Master Git for version control, collaboration, branching strategies, and GitHub workflows",
        "difficulty": "Intermediate",
        "duration": "2 weeks",
        "prerequisites": [],
        "career_paths": ["Data Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "Git & GitHub", "url": "https://www.coursera.org/learn/introduction-git-github", "platform": "Coursera", "type": "FREE"},
            {"title": "Git Complete", "url": "https://www.udemy.com/course/git-complete/", "platform": "Udemy", "type": "PAID"},
            {"title": "GitHub Learning Lab", "url": "https://lab.github.com/", "platform": "GitHub", "type": "FREE"}
        ],
        "order": 11
    },
    # ADVANCED LEVEL
    {
        "id": str(uuid.uuid4()),
        "title": "Machine Learning Fundamentals",
        "description": "Supervised & unsupervised learning, regression, classification, clustering, and model evaluation",
        "difficulty": "Advanced",
        "duration": "6 weeks",
        "prerequisites": ["Python Fundamentals for Data", "Statistics for Data Analysis"],
        "career_paths": ["Data Scientist"],
        "resources": [
            {"title": "Machine Learning by Andrew Ng", "url": "https://www.coursera.org/learn/machine-learning", "platform": "Coursera", "type": "FREE"},
            {"title": "Machine Learning A-Z", "url": "https://www.udemy.com/course/machinelearning/", "platform": "Udemy", "type": "PAID"},
            {"title": "Applied Machine Learning", "url": "https://www.edx.org/learn/machine-learning", "platform": "edX", "type": "FREE"}
        ],
        "order": 12
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Deep Learning & Neural Networks",
        "description": "Neural networks, CNNs, RNNs, TensorFlow, PyTorch, and deep learning architectures",
        "difficulty": "Advanced",
        "duration": "8 weeks",
        "prerequisites": ["Machine Learning Fundamentals"],
        "career_paths": ["Data Scientist"],
        "resources": [
            {"title": "Deep Learning Specialization", "url": "https://www.coursera.org/specializations/deep-learning", "platform": "Coursera", "type": "PAID"},
            {"title": "CS50's Intro to AI with Python", "url": "https://www.edx.org/learn/artificial-intelligence/harvard-university-cs50-s-introduction-to-artificial-intelligence-with-python", "platform": "Harvard edX", "type": "FREE"},
            {"title": "Complete TensorFlow", "url": "https://www.udemy.com/course/complete-tensorflow-2-and-keras-deep-learning-bootcamp/", "platform": "Udemy", "type": "PAID"}
        ],
        "order": 13
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Big Data with Spark & Hadoop",
        "description": "Distributed computing, Spark RDDs, DataFrames, PySpark, and big data processing architectures",
        "difficulty": "Advanced",
        "duration": "5 weeks",
        "prerequisites": ["Python Fundamentals for Data", "Advanced SQL & Query Optimization"],
        "career_paths": ["Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "Big Data with Spark", "url": "https://www.coursera.org/specializations/big-data", "platform": "Coursera", "type": "FREE"},
            {"title": "Apache Spark with Python", "url": "https://www.udemy.com/course/spark-and-python-for-big-data-with-pyspark/", "platform": "Udemy", "type": "PAID"},
            {"title": "Spark Documentation", "url": "https://spark.apache.org/docs/latest/", "platform": "Apache", "type": "FREE"}
        ],
        "order": 14
    },
    {
        "id": str(uuid.uuid4()),
        "title": "ETL Pipelines & Data Engineering",
        "description": "Build scalable ETL pipelines, data orchestration with Airflow, and data warehouse design",
        "difficulty": "Advanced",
        "duration": "5 weeks",
        "prerequisites": ["Advanced SQL & Query Optimization", "Python Fundamentals for Data"],
        "career_paths": ["Data Engineer"],
        "resources": [
            {"title": "Data Engineering Nanodegree", "url": "https://www.udacity.com/course/data-engineer-nanodegree--nd027", "platform": "Udacity", "type": "PAID"},
            {"title": "Airflow Tutorial", "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial.html", "platform": "Apache", "type": "FREE"},
            {"title": "Building Data Engineering Pipelines", "url": "https://www.linkedin.com/learning/building-data-engineering-pipelines-in-python", "platform": "LinkedIn Learning", "type": "PAID"}
        ],
        "order": 15
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Cloud Platforms (AWS, Azure, GCP)",
        "description": "Cloud computing, S3, EC2, Lambda, BigQuery, Azure Data Factory, and cloud data services",
        "difficulty": "Advanced",
        "duration": "6 weeks",
        "prerequisites": ["ETL Pipelines & Data Engineering"],
        "career_paths": ["Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "AWS Certified Data Analytics", "url": "https://aws.amazon.com/training/learn-about/data-analytics/", "platform": "AWS", "type": "FREE"},
            {"title": "Google Cloud Data Engineer", "url": "https://www.coursera.org/professional-certificates/gcp-data-engineering", "platform": "Coursera", "type": "PAID"},
            {"title": "Azure Data Fundamentals", "url": "https://learn.microsoft.com/en-us/training/paths/azure-data-fundamentals/", "platform": "Microsoft Learn", "type": "FREE"}
        ],
        "order": 16
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Natural Language Processing (NLP)",
        "description": "Text processing, sentiment analysis, transformers, BERT, and language models",
        "difficulty": "Advanced",
        "duration": "6 weeks",
        "prerequisites": ["Machine Learning Fundamentals"],
        "career_paths": ["Data Scientist"],
        "resources": [
            {"title": "NLP Specialization", "url": "https://www.coursera.org/specializations/natural-language-processing", "platform": "Coursera", "type": "PAID"},
            {"title": "NLP with Python", "url": "https://www.udemy.com/course/nlp-natural-language-processing-with-python/", "platform": "Udemy", "type": "PAID"},
            {"title": "Hugging Face Course", "url": "https://huggingface.co/course/chapter1/1", "platform": "Hugging Face", "type": "FREE"}
        ],
        "order": 17
    },
    {
        "id": str(uuid.uuid4()),
        "title": "A/B Testing & Experimentation",
        "description": "Design experiments, statistical testing, sample size calculation, and causal inference",
        "difficulty": "Advanced",
        "duration": "4 weeks",
        "prerequisites": ["Statistics for Data Analysis"],
        "career_paths": ["Data Analyst", "Data Scientist"],
        "resources": [
            {"title": "A/B Testing by Google", "url": "https://www.udacity.com/course/ab-testing--ud257", "platform": "Udacity", "type": "FREE"},
            {"title": "Experimentation for Improvement", "url": "https://www.coursera.org/learn/experimentation-for-improvement", "platform": "Coursera", "type": "FREE"}
        ],
        "order": 18
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Business Intelligence & Analytics",
        "description": "BI strategy, metrics design, stakeholder communication, and data-driven decision making",
        "difficulty": "Intermediate",
        "duration": "4 weeks",
        "prerequisites": ["Excel for Data Analysis"],
        "career_paths": ["Business Analyst", "Data Analyst"],
        "resources": [
            {"title": "Business Analytics Specialization", "url": "https://www.coursera.org/specializations/business-analytics", "platform": "Coursera", "type": "FREE"},
            {"title": "Wharton Business Analytics", "url": "https://www.coursera.org/specializations/wharton-business-analytics", "platform": "Coursera", "type": "PAID"},
            {"title": "BI & Analytics", "url": "https://www.linkedin.com/learning/paths/become-a-business-analyst", "platform": "LinkedIn Learning", "type": "PAID"}
        ],
        "order": 19
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Data Interview Preparation",
        "description": "SQL interview questions, coding challenges, case studies, behavioral questions, and system design",
        "difficulty": "Advanced",
        "duration": "Ongoing",
        "prerequisites": [],
        "career_paths": ["Data Analyst", "Business Analyst", "Data Engineer", "Data Scientist"],
        "resources": [
            {"title": "LeetCode SQL Practice", "url": "https://leetcode.com/problemset/database/", "platform": "LeetCode", "type": "FREE"},
            {"title": "StrataScratch", "url": "https://www.stratascratch.com/", "platform": "StrataScratch", "type": "FREE"},
            {"title": "Interview Query", "url": "https://www.interviewquery.com/", "platform": "Interview Query", "type": "PAID"},
            {"title": "Ace the Data Science Interview", "url": "https://www.acethedatascienceinterview.com/", "platform": "Book", "type": "PAID"}
        ],
        "order": 20
    }
]

# Comprehensive projects
PROJECTS_DATA = [
    {
        "id": str(uuid.uuid4()),
        "title": "Sales Dashboard with Power BI",
        "description": "Build an interactive sales analytics dashboard with KPIs, trends, and regional performance analysis",
        "difficulty": "Beginner",
        "skills": ["Power BI", "Excel", "SQL", "Data Visualization"],
        "estimated_time": "2-3 weeks",
        "career_paths": ["Data Analyst", "Business Analyst"],
        "resources": [
            {"title": "Project Guide", "url": "https://www.youtube.com/watch?v=_K-FCbjOMJA", "platform": "YouTube", "type": "FREE"},
            {"title": "Sample Dataset", "url": "https://www.kaggle.com/datasets/kyanyoga/sample-sales-data", "platform": "Kaggle", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Customer Churn Prediction Model",
        "description": "Predict customer churn using machine learning classification algorithms and feature engineering",
        "difficulty": "Intermediate",
        "skills": ["Python", "Scikit-learn", "Pandas", "Machine Learning"],
        "estimated_time": "3-4 weeks",
        "career_paths": ["Data Scientist", "Data Analyst"],
        "resources": [
            {"title": "Churn Dataset", "url": "https://www.kaggle.com/datasets/blastchar/telco-customer-churn", "platform": "Kaggle", "type": "FREE"},
            {"title": "Tutorial", "url": "https://www.datacamp.com/tutorial/predicting-customer-churn-python", "platform": "DataCamp", "type": "FREE"}
        ],
        "github_link": "https://github.com/yourusername/customer-churn"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "E-commerce ETL Pipeline with Airflow",
        "description": "Design and implement a scalable ETL pipeline for e-commerce data using Apache Airflow",
        "difficulty": "Advanced",
        "skills": ["Python", "Airflow", "SQL", "Data Engineering", "ETL"],
        "estimated_time": "4-6 weeks",
        "career_paths": ["Data Engineer"],
        "resources": [
            {"title": "Airflow Tutorial", "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial.html", "platform": "Apache", "type": "FREE"},
            {"title": "ETL Guide", "url": "https://www.youtube.com/watch?v=4rSkygDKTvI", "platform": "YouTube", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "COVID-19 Data Analysis Dashboard",
        "description": "Analyze and visualize COVID-19 trends, vaccination rates, and geographical spread",
        "difficulty": "Beginner",
        "skills": ["Python", "Pandas", "Matplotlib", "Tableau"],
        "estimated_time": "2-3 weeks",
        "career_paths": ["Data Analyst", "Data Scientist"],
        "resources": [
            {"title": "COVID-19 Dataset", "url": "https://github.com/owid/covid-19-data", "platform": "GitHub", "type": "FREE"},
            {"title": "Analysis Guide", "url": "https://www.kaggle.com/code/imdevskp/covid-19-analysis-visualization-comparisons", "platform": "Kaggle", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Sentiment Analysis on Social Media",
        "description": "Perform sentiment analysis on Twitter/Reddit data using NLP techniques and visualize insights",
        "difficulty": "Advanced",
        "skills": ["Python", "NLP", "NLTK", "Transformers", "Data Visualization"],
        "estimated_time": "3-5 weeks",
        "career_paths": ["Data Scientist"],
        "resources": [
            {"title": "Sentiment Analysis Guide", "url": "https://www.tensorflow.org/tutorials/text/text_classification_rnn", "platform": "TensorFlow", "type": "FREE"},
            {"title": "Twitter Dataset", "url": "https://www.kaggle.com/datasets/kazanova/sentiment140", "platform": "Kaggle", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Real Estate Price Prediction",
        "description": "Build a regression model to predict housing prices based on multiple features",
        "difficulty": "Intermediate",
        "skills": ["Python", "Scikit-learn", "Feature Engineering", "Regression"],
        "estimated_time": "3-4 weeks",
        "career_paths": ["Data Scientist", "Data Analyst"],
        "resources": [
            {"title": "Housing Dataset", "url": "https://www.kaggle.com/c/house-prices-advanced-regression-techniques", "platform": "Kaggle", "type": "FREE"},
            {"title": "Tutorial", "url": "https://www.kaggle.com/code/pmarcelino/comprehensive-data-exploration-with-python", "platform": "Kaggle", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Recommendation System",
        "description": "Build a movie or product recommendation engine using collaborative filtering",
        "difficulty": "Advanced",
        "skills": ["Python", "Machine Learning", "Collaborative Filtering", "Matrix Factorization"],
        "estimated_time": "4-5 weeks",
        "career_paths": ["Data Scientist"],
        "resources": [
            {"title": "MovieLens Dataset", "url": "https://grouplens.org/datasets/movielens/", "platform": "GroupLens", "type": "FREE"},
            {"title": "Recommendation Systems", "url": "https://www.coursera.org/learn/recommender-systems-introduction", "platform": "Coursera", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Financial Market Analysis",
        "description": "Analyze stock market data, calculate technical indicators, and build trading strategies",
        "difficulty": "Intermediate",
        "skills": ["Python", "Pandas", "Financial Analysis", "Time Series"],
        "estimated_time": "3-4 weeks",
        "career_paths": ["Data Analyst", "Data Scientist"],
        "resources": [
            {"title": "Stock Market Data", "url": "https://www.kaggle.com/datasets/jacksoncrow/stock-market-dataset", "platform": "Kaggle", "type": "FREE"},
            {"title": "Financial Analysis", "url": "https://www.datacamp.com/courses/importing-managing-financial-data-in-python", "platform": "DataCamp", "type": "PAID"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "SQL Data Warehouse Design",
        "description": "Design and implement a star schema data warehouse for business analytics",
        "difficulty": "Advanced",
        "skills": ["SQL", "Data Modeling", "Data Warehousing", "ETL"],
        "estimated_time": "4-6 weeks",
        "career_paths": ["Data Engineer", "Business Analyst"],
        "resources": [
            {"title": "Data Warehousing Guide", "url": "https://www.guru99.com/data-warehousing.html", "platform": "Guru99", "type": "FREE"},
            {"title": "Dimensional Modeling", "url": "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/", "platform": "Kimball Group", "type": "FREE"}
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Image Classification with CNN",
        "description": "Build a convolutional neural network for image classification using TensorFlow/PyTorch",
        "difficulty": "Advanced",
        "skills": ["Python", "Deep Learning", "TensorFlow", "CNN", "Computer Vision"],
        "estimated_time": "4-6 weeks",
        "career_paths": ["Data Scientist"],
        "resources": [
            {"title": "CIFAR-10 Dataset", "url": "https://www.cs.toronto.edu/~kriz/cifar.html", "platform": "Toronto", "type": "FREE"},
            {"title": "CNN Tutorial", "url": "https://www.tensorflow.org/tutorials/images/cnn", "platform": "TensorFlow", "type": "FREE"}
        ]
    }
]

async def seed_database():
    print(\"Starting database seeding...\")\n    \n    # Clear existing data\n    await db.topics.delete_many({})\n    await db.projects.delete_many({})\n    \n    # Insert topics\n    if TOPICS_DATA:\n        result = await db.topics.insert_many(TOPICS_DATA)\n        print(f\"Inserted {len(result.inserted_ids)} topics\")\n    \n    # Insert projects\n    if PROJECTS_DATA:\n        result = await db.projects.insert_many(PROJECTS_DATA)\n        print(f\"Inserted {len(result.inserted_ids)} projects\")\n    \n    print(\"Database seeding completed!\")\n    print(f\"\\nTotal Topics: {len(TOPICS_DATA)}\")\n    print(f\"Total Projects: {len(PROJECTS_DATA)}\")\n    print(\"\\nCareer Paths Covered:\")\n    print(\"- Data Analyst\")\n    print(\"- Business Analyst\")\n    print(\"- Data Engineer\")\n    print(\"- Data Scientist\")\n\nif __name__ == \"__main__\":\n    asyncio.run(seed_database())

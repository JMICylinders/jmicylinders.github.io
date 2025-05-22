import streamlit as st
import pandas as pd
import requests
import io
import time
from dateutil.relativedelta import relativedelta
from datetime import datetime, timezone, timedelta

# Clear Streamlit's cache to force fresh data every run
st.cache_data.clear()

# Set Page Config
st.set_page_config(page_title="Safety Shoe Status", page_icon="👞", layout="centered")

# Force download fresh Excel file (cachebuster added)
excel_url = f"https://docs.google.com/spreadsheets/d/1VB__QSZM3xOFzml86_9mHXmPLMbOdCE-/export?format=xlsx&cachebuster={int(time.time())}"

try:
    response = requests.get(excel_url)
    response.raise_for_status()
    df = pd.read_excel(io.BytesIO(response.content), sheet_name="Raw")

    # Strip column names and drop unwanted columns
    df.columns = df.columns.str.strip()
    df = df.drop(columns=["Status", "Comment"])

    # --- Custom CSS Styling ---
    st.markdown(
        """
        <style>
        h1 {
            text-align: center;
            color: #2c3e50;
            font-size: 2rem;
            font-weight: bold;
        }
        h3 {
            text-align: center;
            color: #2c3e50;
            font-size: 1.5rem;
        }
        .stTextInput > div > div > input {
            font-size: 18px;
            padding: 10px;
        }
        .stButton > button {
            font-size: 18px;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: 0.3s;
        }
        .stButton > button:hover {
            background-color: #2980b9;
        }
        .data-container {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }
        @media screen and (max-width: 768px) {
            h1 {
                font-size: 1.5rem !important;
            }
            h3 {
                font-size: 1.2rem;
            }
            .safety-care-title {
                font-size: 1.5rem !important;
                font-weight: bold;
                text-align: center;
                color: #2c3e50;
            }
        }
        .stDataFrame {
            width: 100% !important;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Show Title and Current Date (BD Time)
    bd_time = datetime.now(timezone.utc) + timedelta(hours=6)
    formatted_date = bd_time.strftime("%d %B, %Y")

    st.markdown(f"""
        <h1>👞 Personal Protective Equipment Status Checker</h1>
        <h3 style='text-align: center; color: #7f8c8d;'>📅 আজকের তারিখ: {formatted_date}</h3>
    """, unsafe_allow_html=True)

    # Search Box
    emp_id = st.text_input("🔍 Enter Employee ID:", "")
    st.write("")
    col1, col2, col3 = st.columns([2, 1, 2])
    with col2:
        submit = st.button("🔎 Submit")

    if submit:
        if emp_id:
            filtered_df = df[df["ID"].astype(str).str.strip() == emp_id.strip()]
            filtered_df = filtered_df[filtered_df["ID"].notna() & (filtered_df["ID"] != "")]
            if not filtered_df.empty:
                st.markdown("<h3>Employee PPE Information</h3>", unsafe_allow_html=True)

                # Convert 'Date' to datetime
                filtered_df["Date"] = pd.to_datetime(filtered_df["Date"], errors="coerce")

                # Sort by Date descending (latest at top)
                filtered_df = filtered_df.sort_values(by="Date", ascending=False)

                # Calculate duration in years, months, days
                filtered_df["Duration"] = filtered_df["Date"].apply(lambda x: relativedelta(bd_time.date(), x))

                # Format duration as 'X years X months X days'
                filtered_df["Duration"] = filtered_df["Duration"].apply(
                    lambda x: f"{x.years} years {x.months} months {x.days} days"
                )

                # Slice columns from 'ID' to 'Date' then add 'Duration'
                id_to_date = filtered_df.loc[:, "ID":"Date"]
                display_df = pd.concat([id_to_date, filtered_df[["Duration"]]], axis=1)

                # Display result
                st.dataframe(display_df.style.set_properties(**{'text-align': 'center'}), height=400, use_container_width=True)
            else:
                st.error("❌ Employee ID not found! Please check and try again.")
        else:
            st.warning("⚠️ Please enter an Employee ID before submitting.")

    st.write("\n\n")

    # Safety Shoe Care Instructions in Bangla
    st.markdown("<h3 class='safety-care-title'>🔧 Safety Shoe Care Instructions</h3>", unsafe_allow_html=True)
    st.markdown("""
        <ul>
            <li><b>শুকনো জায়গায় রাখুন:</b> ভিজে জুতো শুকানোর জন্য সরাসরি সূর্যালোকের নিচে না রেখে, ছায়াযুক্ত এবং শুকনো জায়গায় রাখুন।</li>
            <li><b>সবসময় মোজা পরুন:</b> সেফটি শু পরার সময় সবসময় মোজা পরুন। এটি পায়ের আরাম বাড়ায় এবং সেফটি শু’র ক্ষতি থেকে রক্ষা করে।</li>
            <li><b>পানি থেকে রক্ষা করুন:</b> জুতোতে পানি প্রবাহিত হলে তার ক্ষতি হতে পারে। তাই ভিজে এলাকা থেকে বাঁচিয়ে রাখুন।</li>
            <li><b>সঠিক আকারের জুতো ব্যবহার করুন:</b> আপনার পায়ের আকার অনুযায়ী সঠিক সাইজের সেফটি শু ব্যবহার করুন।</li>
            <li><b>ধুলা মুছুন:</b> জুতোটি পরার পর নিয়মিত ধুলা মুছুন। এটি জুতোর স্থায়ীত্ব বাড়াতে সাহায্য করবে।</li>
            <li><b>পালিশ করুন:</b> লেদারের জুতো নিয়মিত পালিশ করলে তার চকচকে ভাব এবং স্থায়ীত্ব বজায় থাকে।</li>
        </ul>
    """, unsafe_allow_html=True)

except Exception as e:
    st.error("❌ Failed to load data from Google Sheets.")
    st.exception(e)

import streamlit as st
import pandas as pd
import requests
from PIL import Image
from io import BytesIO
import base64

# ✅ This must be the first Streamlit command
st.set_page_config(page_title="Safety Violation", layout="wide")

# Helper function to convert PIL Image to base64
def img_to_base64(image):
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()

# Custom CSS Styling
st.markdown("""
    <style>
    .card {
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.06);
        margin: 0.5rem;
        text-align: center;
    }
    .card-title {
        font-weight: 600;
        font-size: 1.1rem;
        color: #333333;
        margin-bottom: 0.5rem;
    }
    .card-caption {
        font-size: 0.9rem;
        color: #666666;
        margin-top: 0.5rem;
    }
    .card-fine {
        font-size: 1rem;
        color: #ff6347;
        font-weight: 600;
        margin-top: 0.5rem;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown("<h3 style='text-align: center; color: red;'>🚨 Safety Violation</h3>", unsafe_allow_html=True)

# Load data from Google Sheets
sheet_url = "https://docs.google.com/spreadsheets/d/14fR8BCvYm6HzOjQ8bzZ7sMNa8SPESkjO9NzVABgwZxw/gviz/tq?tqx=out:csv&sheet=Raw"
df = pd.read_csv(sheet_url)

# Convert and clean date
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
df = df.dropna(subset=['Emp ID', 'Date', 'Upload Image'])

# Search box
emp_id = st.text_input("🔍 Enter Employee ID to view safety violations:")

if emp_id:
    filtered_df = df[df['Emp ID'].astype(str) == emp_id]

    if not filtered_df.empty:
        name = filtered_df['Name'].iloc[0]
        dept = filtered_df['Department'].iloc[0]

        st.markdown(f"### 👤 Name: `{name}`  \n🏢 Department: `{dept}`")

        # Ensure 'Fine' is numeric
        filtered_df['Fine'] = pd.to_numeric(filtered_df['Fine'], errors='coerce')

        # Calculate total fine
        total_fine = filtered_df['Fine'].sum()

        # Show total fine
        st.markdown(f"### 💰 Total Fine: `{total_fine:.2f}` BDT")

        st.markdown("### 📸 Violation History")

        # Sort by date (earliest first)
        sorted_df = filtered_df.sort_values('Date')
        num_images = len(sorted_df)

        if num_images == 1:
            row = sorted_df.iloc[0]
            img_url = row['Upload Image']
            date_str = row['Date'].strftime('%d/%m/%Y')
            caption = row['Description of Violation']
            fine = row['Fine']

            if "drive.google.com" in img_url:
                if "id=" in img_url:
                    file_id = img_url.split("id=")[-1]
                elif "/file/d/" in img_url:
                    file_id = img_url.split("/file/d/")[1].split("/")[0]
                else:
                    file_id = None

                direct_url = f"https://drive.google.com/uc?export=download&id={file_id}" if file_id else img_url
            else:
                direct_url = img_url

            try:
                response = requests.get(direct_url)
                img = Image.open(BytesIO(response.content))

                st.markdown(f"""
                    <div class="card" style="width: 500px; margin: 0 auto;">
                        <div class="card-title">📅 {date_str}</div>
                        <img src="data:image/jpeg;base64,{img_to_base64(img)}" style="width:100%; border-radius:8px;" />
                        <div class="card-caption">📝 {caption}</div>
                        <div class="card-fine">💰 Fine: {fine}</div>
                    </div>
                """, unsafe_allow_html=True)
            except Exception as e:
                st.error(f"❌ Error loading image: {e}")

        else:
            scroll_container = st.container()
            with scroll_container:
                cols = st.columns(num_images)

                for col, (_, row) in zip(cols, sorted_df.iterrows()):
                    img_url = row['Upload Image']
                    date_str = row['Date'].strftime('%d/%m/%Y')
                    caption = row['Description of Violation']
                    fine = row['Fine']

                    if "drive.google.com" in img_url:
                        if "id=" in img_url:
                            file_id = img_url.split("id=")[-1]
                        elif "/file/d/" in img_url:
                            file_id = img_url.split("/file/d/")[1].split("/")[0]
                        else:
                            file_id = None

                        direct_url = f"https://drive.google.com/uc?export=download&id={file_id}" if file_id else img_url
                    else:
                        direct_url = img_url

                    try:
                        response = requests.get(direct_url)
                        img = Image.open(BytesIO(response.content))

                        with col:
                            st.markdown(f"""
                                <div class="card">
                                    <div class="card-title">📅 {date_str}</div>
                                    <img src="data:image/jpeg;base64,{img_to_base64(img)}" style="width:100%; border-radius:8px;" />
                                    <div class="card-caption">📝 {caption}</div>
                                    <div class="card-fine">💰 Fine: {fine}</div>
                                </div>
                            """, unsafe_allow_html=True)
                    except Exception as e:
                        col.error(f"❌ Error loading image: {e}")
    else:
        st.warning("No data found for this Employee ID.")

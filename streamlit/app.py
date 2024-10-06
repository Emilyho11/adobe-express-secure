import streamlit as st
import random
import time
from datetime import datetime, timedelta
import pandas as pd

st.write("# Analytics Dashboard")

# Mock data with longitude and latitude for each user
mock_data = [
    {
        "id": "13",
        "type": "page_view",
        "user_name": "john",
        "time_stamp": int(datetime(2024, 9, 1).timestamp()),
        "lon": -74.0060,
        "lat": 40.7128,
    },
    {
        "id": "14",
        "type": "add_viewer",
        "user_name": "alex",
        "time_stamp": int(datetime(2024, 9, 3).timestamp()),
        "value": "mike",
        "lon": -118.243683,
        "lat": 34.052235,
    },
    {
        "id": "15",
        "type": "remove_viewer",
        "user_name": "sam",
        "time_stamp": int(datetime(2024, 9, 3).timestamp()),
        "value": "mike",
        "lon": -122.419418,
        "lat": 37.774929,
    },
    {
        "id": "16",
        "type": "update_file",
        "user_name": "john",
        "time_stamp": int(datetime(2024, 9, 3).timestamp()),
        "lon": -74.0060,
        "lat": 40.7128,
    },
    {
        "id": "17",
        "type": "page_view",
        "user_name": "mike",
        "time_stamp": int(datetime(2024, 9, 5).timestamp()),
        "lon": -87.6298,
        "lat": 41.8781,
    },
    {
        "id": "18",
        "type": "add_viewer",
        "user_name": "lisa",
        "time_stamp": int(datetime(2024, 9, 5).timestamp()),
        "value": "john",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "19",
        "type": "remove_viewer",
        "user_name": "mike",
        "time_stamp": int(datetime(2024, 9, 7).timestamp()),
        "value": "lisa",
        "lon": -87.6298,
        "lat": 41.8781,
    },
    {
        "id": "20",
        "type": "update_file",
        "user_name": "lisa",
        "time_stamp": int(datetime(2024, 9, 8).timestamp()),
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "1",
        "type": "page_view",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 10).timestamp()),
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "2",
        "type": "add_viewer",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 10).timestamp()),
        "value": "emily",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "3",
        "type": "remove_viewer",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 10).timestamp()),
        "value": "emily",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "5",
        "type": "page_view",
        "user_name": "alex",
        "time_stamp": int(datetime(2024, 9, 10).timestamp()),
        "lon": -118.243683,
        "lat": 34.052235,
    },
    {
        "id": "6",
        "type": "add_viewer",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 13).timestamp()),
        "value": "john",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "7",
        "type": "remove_viewer",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 14).timestamp()),
        "value": "john",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "8",
        "type": "update_file",
        "user_name": "alex",
        "time_stamp": int(datetime(2024, 9, 15).timestamp()),
        "lon": -118.243683,
        "lat": 34.052235,
    },
    {
        "id": "9",
        "type": "page_view",
        "user_name": "sam",
        "time_stamp": int(datetime(2024, 9, 17).timestamp()),
        "lon": -122.419418,
        "lat": 37.774929,
    },
    {
        "id": "10",
        "type": "add_viewer",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 17).timestamp()),
        "value": "lisa",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "11",
        "type": "remove_viewer",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 18).timestamp()),
        "value": "lisa",
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "12",
        "type": "update_file",
        "user_name": "sam",
        "time_stamp": int(datetime(2024, 9, 19).timestamp()),
        "lon": -122.419418,
        "lat": 37.774929,
    },
    {
        "id": "4",
        "type": "update_file",
        "user_name": "gigi",
        "time_stamp": int(datetime(2024, 9, 20).timestamp()),
        "lon": -79.3832,
        "lat": 43.6532,
    },
    {
        "id": "21",
        "type": "page_view",
        "user_name": "john",
        "time_stamp": int(datetime(2024, 9, 1, 12, 0).timestamp()),
        "lon": -74.0060,
        "lat": 40.7128,
    },
    {
        "id": "22",
        "type": "add_viewer",
        "user_name": "alex",
        "time_stamp": int(datetime(2024, 9, 2, 15, 30).timestamp()),
        "value": "mike",
        "lon": -118.243683,
        "lat": 34.052235,
    },
    {
        "id": "23",
        "type": "remove_viewer",
        "user_name": "sam",
        "time_stamp": int(datetime(2024, 9, 3, 9, 45).timestamp()),
        "value": "mike",
        "lon": -122.419418,
        "lat": 37.774929,
    },
    {
        "id": "24",
        "type": "update_file",
        "user_name": "john",
        "time_stamp": int(datetime(2024, 9, 4, 18, 20).timestamp()),
        "lon": -74.0060,
        "lat": 40.7128,
    },
    {
        "id": "25",
        "type": "page_view",
        "user_name": "mike",
        "time_stamp": int(datetime(2024, 9, 5, 11, 10).timestamp()),
        "lon": -87.6298,
        "lat": 41.8781,
    },
    {
        "id": "26",
        "type": "page_view",
        "user_name": "john",
        "time_stamp": int(datetime(2024, 9, 1, 14, 0).timestamp()),
        "lon": -74.0060,
        "lat": 40.7128,
    },
    {
        "id": "27",
        "type": "add_viewer",
        "user_name": "alex",
        "time_stamp": int(datetime(2024, 9, 2, 16, 30).timestamp()),
        "value": "mike",
        "lon": -118.243683,
        "lat": 34.052235,
    },
    {
        "id": "28",
        "type": "remove_viewer",
        "user_name": "sam",
        "time_stamp": int(datetime(2024, 9, 3, 10, 45).timestamp()),
        "value": "mike",
        "lon": -122.419418,
        "lat": 37.774929,
    },
    {
        "id": "29",
        "type": "update_file",
        "user_name": "john",
        "time_stamp": int(datetime(2024, 9, 4, 19, 20).timestamp()),
        "lon": -74.0060,
        "lat": 40.7128,
    },
    {
        "id": "30",
        "type": "page_view",
        "user_name": "mike",
        "time_stamp": int(datetime(2024, 9, 5, 12, 10).timestamp()),
        "lon": -87.6298,
        "lat": 41.8781,
    },
]
mock_data.sort(key=lambda x: x["time_stamp"])

# Select date range for the dashboard
end_date = datetime(2024, 10, 5)
start_date = end_date - timedelta(days=60)


# Helper function to transform data's time_stamp
def format_event_dates(event):
    event["time_stamp"] = datetime.fromtimestamp(event["time_stamp"])
    return event


orig_df = pd.DataFrame(format_event_dates(event) for event in mock_data)

# Ensure the 'time_stamp' column is in datetime format
orig_df["time_stamp"] = pd.to_datetime(orig_df["time_stamp"])

st.write("## Overview")

# Group by date and event type, then count occurrences
event_counts = (
    orig_df.groupby([orig_df["time_stamp"].dt.date, "type"])
    .size()
    .unstack(fill_value=0)
)

# Plot the line chart
st.line_chart(event_counts)

col1, col2 = st.columns(2)

# Visual to show how many more events there are in the past week compared to the previous week
past_week = orig_df[
    (orig_df["time_stamp"] >= end_date - timedelta(days=14))
    & (orig_df["time_stamp"] <= end_date - timedelta(days=7))
]
previous_week = orig_df[
    (orig_df["time_stamp"] >= end_date - timedelta(days=28))
    & (orig_df["time_stamp"] <= end_date - timedelta(days=21))
]

past_week_count = past_week.shape[0]
previous_week_count = previous_week.shape[0]

with col1:
    st.metric(
        label="Events in the last week",
        value=past_week_count,
        delta=past_week_count - previous_week_count,
    )

# Visual to show the number of events in the past month compared to the previous month
past_month = orig_df[
    (orig_df["time_stamp"] >= end_date - timedelta(days=30))
    & (orig_df["time_stamp"] <= end_date)
]
previous_month = orig_df[
    (orig_df["time_stamp"] >= end_date - timedelta(days=60))
    & (orig_df["time_stamp"] <= end_date - timedelta(days=30))
]

past_month_count = past_month.shape[0]
previous_month_count = previous_month.shape[0]

with col2:
    st.metric(
        label="Events in the last month",
        value=past_month_count,
        delta=past_month_count - previous_month_count,
    )

st.write("## View Events in a Date Range")

# Create a double-ended datetime slider
selected_date_range = st.slider(
    "Select a date range",
    min_value=start_date,
    max_value=end_date,
    value=(end_date - timedelta(days=30), end_date),
    step=timedelta(days=1),
)

# Show leaderboards
col3, col4 = st.columns(2)

# Filter df based on selected date range
df = orig_df[
    (orig_df["time_stamp"] >= selected_date_range[0])
    & (orig_df["time_stamp"] <= selected_date_range[1])
]

# Show count of events in the selected date range
st.metric("Events in the selected date range", len(df))
st.write("The following events occurred within the selected date range")


st.write(df)

if not df.empty:
    st.write("Location of events")
    st.map(df)
else:
    st.write("No events found in the selected date range.")

col3, col4 = st.columns(2)

# Event count within the selected date range
selected_event_count = df["type"].value_counts()
with col3:
    st.write("Event count")
    st.write(selected_event_count)

# Top users within the selected date range
selected_top_users = df["user_name"].value_counts().head(5)
with col4:
    st.write("Top 5 users")
    st.write(selected_top_users)

st.write(
    """ <style>
    .stDataFrame {
    width: 100%;
    }
         </style>""",
    unsafe_allow_html=True,
)

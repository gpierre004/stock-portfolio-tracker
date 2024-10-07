import pandas as pd
import psycopg2
from psycopg2 import sql
from datetime import datetime
import numpy as np

# Database connection details
db_params = {
    'dbname': 'stocks_database',
    'user': 'postgres',
    'password': '1215',
    'host': 'localhost',
    'port': 5432
}

# CSV file path
csv_file_path = r'C:\Users\gbelj\Downloads\Accounts_History.csv'

# Read the CSV file
df = pd.read_csv(csv_file_path)

print(df.columns)  # Add this line to check column names

# Function to safely convert dates
def safe_date_convert(x):
    if pd.isna(x):
        return None
    try:
        return str(datetime.strptime(str(x).strip(), '%m/%d/%Y').strftime('%Y-%m-%d %H:%M:%S'))
    except ValueError:
        return None

# Create a new column for CreatedAt and UpdatedAt
df['CreatedAt'] = df['transactiondate'].apply(safe_date_convert)
df['UpdatedAt'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Convert numeric columns to float
df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
df['transactionprice'] = pd.to_numeric(df['transactionprice'], errors='coerce')

# Replace NaN values with None for SQL compatibility
df = df.replace({np.nan: None})

# Connect to PostgreSQL database
try:
    connection = psycopg2.connect(**db_params)
    cursor = connection.cursor()

    # Create the transactions table if it doesn't exist
    create_table_query = sql.SQL(
        """
        CREATE TABLE IF NOT EXISTS public.transactions (
            portfoliostockid TEXT PRIMARY KEY,
            transactiontype TEXT,
            quantity REAL,
            transactionprice REAL,
            transactiondate TEXT,
            amount REAL,
            description TEXT,
            CreatedAt TEXT,
            UpdatedAt TEXT
        )
    """
    )
    cursor.execute(create_table_query)

    # Insert data into the table
    for index, row in df.iterrows():
        insert_query = sql.SQL(
            """
            INSERT INTO public.transactions (
                portfoliostockid, transactiontype, quantity, transactionprice, transactiondate, amount, description, CreatedAt, UpdatedAt
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
        )
        cursor.execute(insert_query, (
            row['portfoliostockid'],
            row['transactiontype'],
            row['quantity'],
            row['transactionprice'],
            row['transactiondate'],
            row['amount'],
            row['description'],
            row['CreatedAt'],
            row['UpdatedAt']
        ))

    # Commit the changes to the database
    connection.commit()
    print("Data inserted successfully")

except Exception as error:
    print(f"Error inserting data: {error}")

finally:
    if connection:
        cursor.close()
        connection.close()
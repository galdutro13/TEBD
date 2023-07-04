import os
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("Prepare data for neo4j") \
    .config("spark.driver.extraJavaOptions", "-XX:+UseCompressedOops") \
    .config("spark.executor.extraJavaOptions", "-XX:+UseCompressedOops") \
    .config("spark.sql.shuffle.partitions", 24) \
    .config("spark.executor.memory", "6g") \
    .config("spark.driver.memory", "6g") \
    .getOrCreate()

print(spark.version)


def adapt_release():
    df_release = spark.read\
        .option("header", "true")\
        .option("multiline", "true")\
        .option("quote", "\"")\
        .option("escape", "\"")\
        .csv("release.csv")

    df_release = df_release.drop("notes")
    df_release = df_release.drop("data_quality")

    df_release.coalesce(1).write.format("csv").save("df_release.csv", header=True)


def convert_csv_to_parquet(directory):
    # Lista todos os arquivos no diretório
    files = os.listdir(directory)

    for file in files:
        # Verifica se o arquivo é um csv
        if file.endswith('.csv'):
            # Cria os caminhos completos para os arquivos CSV e Parquet
            csv_path = os.path.join(directory, file)
            parquet_path = os.path.join('Parquet', file.replace('.csv', '.parquet'))

            # Lê o arquivo CSV
            df = spark.read.option("header", "true").option("multiline", "true").csv(csv_path)

            # Escreve o DataFrame para o formato Parquet
            df.write.parquet(parquet_path)

            print(f'Converted {csv_path} to {parquet_path}')


def sample_and_save(directory, sample_size=8192):
    # Carrega o DataFrame 'release'
    release_df = spark.read.parquet(os.path.join(directory, 'release.parquet'))

    # Realiza a amostragem
    fraction = sample_size / release_df.count()
    sampled_release_df = release_df.sample(withReplacement=False, fraction=fraction)

    # Salva o DataFrame amostrado como CSV
    sampled_release_df.coalesce(1).write.csv(os.path.join('CSV_sampled', 'release.csv'), header=True)

    # Lista todos os arquivos no diretório
    files = os.listdir(directory)
    files = list(filter(lambda x: x.startswith('release') and x != 'release.parquet', files))

    for file in files:
        # Ignora o arquivo 'release.parquet' já que já o processamos
        if file != 'release.parquet' and file.endswith('.parquet'):
            # Carrega o DataFrame
            df = spark.read.parquet(os.path.join(directory, file))

            # Filtra o DataFrame com base no DataFrame 'release' amostrado
            df = df.join(sampled_release_df.select('id'), df.release_id == sampled_release_df.id, 'left_semi')

            # Salva o DataFrame filtrado como CSV
            df.coalesce(1).write.csv(os.path.join('CSV_sampled', file.replace('.parquet', '.csv')), header=True)


# Uso da função:
# convert_csv_to_parquet('CSV')
sample_and_save('Parquet')
# adapt_release()

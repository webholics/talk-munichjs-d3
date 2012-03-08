import csv

data = dict()

reader = csv.DictReader(open("fertility.csv", "rU"), delimiter=";")
for row in reader:
    for key in row:
        if key != "Children per woman":
            if key not in data:
                data[key] = dict()
            d = data[key]
            country = row["Children per woman"].strip()
            d[country] = dict(fertility = row[key])

reader = csv.DictReader(open("mortality.csv", "rU"), delimiter=";")
for row in reader:
    for key in row:
        if key != "Under-five mortality rate":
            if key not in data:
                data[key] = dict()
            d = data[key]
            country = row["Under-five mortality rate"].strip()
            if country in d:
                d[country]["mortality"] = row[key]
            else:
                d[country] = dict(mortality = row[key])

reader = csv.DictReader(open("population.csv", "rU"), delimiter=";")
for row in reader:
    for key in row:
        if key != "Total population":
            if key not in data:
                data[key] = dict()
            d = data[key]
            country = row["Total population"].strip()
            if country in d:
                d[country]["population"] = row[key]
            else:
                d[country] = dict(population = row[key])

data_array = []
for year in data:
    if int(year) < 1960:
        continue
    for country in data[year]:
        entry = data[year][country]
        fertility = False
        if "fertility" in entry and entry["fertility"]:
            fertility = float(entry["fertility"].replace(",","."))
        mortality = False
        if "mortality" in entry and entry["mortality"]:
            mortality = 1.0 - float(entry["mortality"].replace(",",".")) / 1000.0
        population = False
        if "population" in entry and entry["population"]:
            population = int(entry["population"].replace(".",""))

        if fertility and mortality and population:
            row = [year, country, mortality, fertility, population]
            data_array.append(row)

def compare(a, b):
	return cmp(a[0], b[0]) or cmp(b[1], a[1])
data_array.sort(compare)

writer = csv.writer(open("../ted.csv", "wb"), delimiter=',') 
writer.writerow(["year", "country", "survival", "children", "population"])
writer.writerows(data_array)

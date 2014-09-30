import calendar

def blog_date(date):
    date = map(int, str(date)[5:].split('-'))
    month = calendar.month_name[date[0]]
    day = date[1]
    return month[:3] + " " + str(day)
    

if __name__ == "__main__":
    date = '2014-12-10'
    print(blog_date(date))

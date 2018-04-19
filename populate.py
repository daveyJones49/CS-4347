#!/usr/bin/python

from datetime import date
from random import choice, randrange, random
from collections import deque, namedtuple

#parse appliances
appliances = []
with open('appliances.txt', 'r') as g:
	for line in g:
		if len(line.strip()) < 50:
			appliances.append(line.strip())

#parse groceries
groceries = []
with open('groceries.txt', 'r') as g:
	for line in g:
		if len(line.strip()) < 50:
			groceries.append(line.strip())

#parse homegoods
homegoods = []
with open('homegoods.txt', 'r') as g:
	for line in g:
		if len(line.strip()) < 50:
			homegoods.append(line.strip())

#parse name lexicon
names = []
with open('baby-names.csv', 'r') as babies:
	for i, line in enumerate(babies):
		if i:
			names.append(line.strip().split(',')[1][1:-1])

#parse noun lexicon
nouns = []
with open('nounlist.txt', 'r') as f:
	for line in f:
		nouns.append(line.strip())

#store population
STOREFORMAT = '''

INSERT INTO STORE values (
	%s,
	"%s",  
	"%s",
	%s,
	"%s",
	"%s",
	"%s",
	"%s",
	"%s"
);

'''.strip()

Store = namedtuple('Store', ["store_id", "city", "street", "zipcode", 
	"phone_number", "open_time", "close_time", "holiday_open", "holiday_close"])

stores = []
for storeid in xrange(1, 4):
	store_city = choice(nouns) + choice((" city", " town", "ville", " burrow", "borough", " valley"))
	while len(store_city) >= 60:
		store_city = choice(nouns) + choice((" city", " town", "ville", " burrow", "borough", " valley"))
	
	store_street = choice(nouns) + choice((" ln", " pkwy", " blvd"))
	while len(store_street) >= 60:
		store_street = choice(nouns) + choice((" ln", " pkwy", " blvd"))
	
	stores.append(Store(
		storeid,
		store_city if storeid != 1 else "landmineville",
		store_street,
		randrange(10000, 100000),
		str(randrange(10**9, 10**10)),
		'%s:%s' % (randrange(0, 25), randrange(0, 60)),
		'%s:%s' % (randrange(0, 25), randrange(0, 60)),
		'%s:%s' % (randrange(0, 25), randrange(0, 60)),
		'%s:%s' % (randrange(0, 25), randrange(0, 60)),
	))

for s in stores:
	print STOREFORMAT % s
	print

#employee population
EMPLOYEEFORMAT = '''

INSERT INTO EMPLOYEE values (
	%s,
	"%s",  
	"%s",
	"%s",
	"%s",
	"%s",
	"%s",
	%s,
	%s,
	%s,
	%s
);

'''.strip()

Employee = namedtuple('Employee', ["employee_id", "name", "city", 
	"street", "zipcode", "phone_number", "date_of_hire", "shift_number", 
	"pto_amount", "fk_superior_id", "fk_store_id"])

employees = []
employeeid = 1
for s in stores:
	for x in xrange(200):
		employee_name = choice(names) + ' ' + choice(names)
		while len(employee_name) >= 80:
			employee_name = choice(names) + ' ' + choice(names)
		
		employee_street = choice(nouns) + ' ' + choice(nouns)
		while len(employee_street) >= 60:
			employee_street = choice(nouns) + ' ' + choice(nouns)
		
		employees.append(Employee(
			employeeid,
			employee_name,
			s.city,
			employee_street,
			s.zipcode,
			str(randrange(10**9, 10**10)),
			'%s-%s-%s' % (randrange(1980, 2019), randrange(1, 13), randrange(1, 28)),
			randrange(1, 5),
			randrange(0, 121),
			'NULL' if x%20 == 0 else employeeid - x%20,
			s.store_id
		))
		employeeid += 1

for e in employees:
	print EMPLOYEEFORMAT % e
	print

#customer population
CUSTOMERFORMAT = '''

INSERT INTO CUSTOMER values (
	%s,
	"%s",  
	"%s",
	%s
);

'''.strip()

Customer = namedtuple('Customer', ['reward_card_number', 'name',
	'phone_number', 'fk_employee_id'])

customers = []
used_customer_ids = set()
for _ in xrange(1, 101):
	e = choice(employees)
	while e.fk_superior_id == 'NULL':
		e = choice(employees)
	
	customer_id = randrange(10**6, 10**7)
	while customer_id in used_customer_ids:
		customer_id = randrange(10**6, 10**7)
	used_customer_ids.add(customer_id)
	
	customer_name = choice(names) + ' ' + choice(names)
	while len(customer_name) >= 50:
		customer_name = choice(names) + ' ' + choice(names)
	
	customers.append(Customer(
		customer_id,
		customer_name,
		str(randrange(10**9, 10**10)),
		e.employee_id
	))

for c in customers:
	print CUSTOMERFORMAT % c
	print

DEPARTMENTFORMAT = '''

INSERT INTO DEPARTMENT values (
	%s,
	%s,  
	%s,
	%s,
	%s,
	%s,
	%s,
	"%s",
	%s,
	%s,
	%s
);

'''.strip()

Department = namedtuple('Department', ["department_id", "active_registers",
	"craft_station_open", "photo_lab_open", "date_of_last_inspection", 
	"floor_number", "number_of_freezers", "department_type", 
	"total_registers", "fk_manager_id", "fk_store_id"])

departments = []
department_id = 1
for s in stores:
	for department_type in ("Electronics", "Homegoods", "Grocery", "Checkout"):
		e = choice(employees)
		while not e.fk_superior_id:
			e = choice(employees)

		departments.append(Department(
			department_id,
			randrange(2, 29) if department_type == "Checkout" else 'NULL',
			randrange(0,2) if department_type == "Homegoods" else 'NULL',
			randrange(0,2) if department_type == "Electronics" else 'NULL',
			'"%s-%s-%s"' % (randrange(1980, 2019), randrange(1, 13), randrange(1, 28)) if department_type == "Grocery" else  'NULL',
			randrange(1,4),
			randrange(0,31) if department_type == "Grocery" else 'NULL',
			department_type,
			randrange(0,25) if department_type == "Checkout" else 'NULL',
			e.employee_id,
			s.store_id
		))
		
		department_id += 1

for d in departments:
	print DEPARTMENTFORMAT % d
	print

ENTRYFORMAT = '''

INSERT INTO ENTRY values (
	%s,
	%s,
	%s
);

'''.strip()

Entry = namedtuple('Entry', ["hours_worked", "hourly_pay", "fk_employee_id"])

entries = []
for e in employees:
	if e.fk_superior_id != 'NULL':
		entries.append(Entry(
			randrange(0, 40),
			randrange(8, 15),
			e.employee_id
		))

for e in entries:
	print ENTRYFORMAT % e
	print

MANAGERFORMAT = '''

INSERT INTO MANAGER values (
	%s,
	%s,
	%s
);

'''.strip()

Manager = namedtuple('Manager', ["bonus", "salary", "fk_employee_id"])

managers = []
for e in employees:
	if e.fk_superior_id == 'NULL':
		managers.append(Entry(
			randrange(500, 2501),
			randrange(31200, 55001),
			e.employee_id
		))

for m in managers:
	print MANAGERFORMAT % m
	print

WORKSINFORMAT = '''

INSERT INTO WORKS_IN values (
	%s,
	%s
);

'''.strip()

Worksin = namedtuple('Worksin', ['fk_department_id', 'fk_employee_id'])

worksins = []
for e in employees:
	s = e.fk_superior_id
	if s != 'NULL':
		for w in worksins:
			if w.fk_employee_id == s:
				d = w.fk_department_id
				break
	else:
		d = choice(departments).department_id
	
	worksins.append(Worksin(
		d,
		e.employee_id
	))

for w in worksins:
	print WORKSINFORMAT % w

ITEMFORMAT = '''

INSERT INTO ITEM VALUES(
	%s,
	"%s",
	%.2f,
	%s,
	%s,
	%s,
	%s,
	%s
);

'''

Item = namedtuple('Item', ["item_id", "name", "price", 
	"discount", "quantity_in_stock", "transaction_id", 
	"fk_reward_card_number", "fk_department_id"])

items = []
item_id = 1
for c in customers:
	for x in xrange(randrange(1, 5)):
		for e in employees:
			if e.employee_id == c.fk_employee_id:
				break
		
		kitty = randrange(3)
		department_id = 1 + 4*(e.fk_store_id-1) + kitty

		items.append(Item(
			item_id,
			choice([appliances, homegoods, groceries][kitty]),
			randrange(99, 1000000) / 100.0,
			randrange(10, 71),
			randrange(0, 1000),
			randrange(100, 1000),
			c.reward_card_number,
			department_id
		))
		item_id += 1

for i in items:
	print ITEMFORMAT % i
	print

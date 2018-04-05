DROP DATABASE  IF EXISTS commydb;
CREATE DATABASE IF NOT EXISTS commydb;
USE commydb;

DROP TABLE IF EXISTS CUSTOMER;
CREATE TABLE CUSTOMER (
    reward_card_number                  INTEGER         NOT NULL,
    fk_employee_id                      INTEGER         NOT NULL, 
    name                                VARCHAR(50)     NOT NULL,
    phone_number                        VARCHAR(10)             ,
    PRIMARY KEY (reward_card_number),
    UNIQUE(fk_employee_id),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE(employee_id)
);



DROP TABLE IF EXISTS DEPARTMENT;
CREATE TABLE DEPARTMENT (
    department_id               INTEGER         NOT NULL, 
    fk_manager_id               INTEGER         NOT NULL,
    fk_store_id                 INTEGER         NOT NULL,
    active_registers            INTEGER                 ,
    craft_station_open          BOOLEAN                 ,
    date_of_last_inspection     DATE                    ,
    floor_number                INTEGER                 ,
    name                        VARCHAR(80)     NOT NULL,
    number_of_freezers          INTEGER                 ,
    department_type             VARCHAR(20)             ,
    total_registers             INTEGER                 ,
    PRIMARY KEY (department_id),
    FOREIGN KEY (fk_manager_id) REFERENCES EMPLOYEE(employee_id),
    FOREIGN KEY (fk_store_id)   REFERENCES STORE(store_id)
);


DROP TABLE IF EXISTS EMPLOYEE;
CREATE TABLE EMPLOYEE (  
    employee_id                 INTEGER         NOT NULL,
    name                        VARCHAR(80)     NOT NULL,
    address                     VARCHAR(200)            ,
    phone_number                VARCHAR(10)             ,
    date_of_hire                DATE            NOT NULL,
    shift_number                INTEGER                 ,
    pto_amount                  INTEGER                 ,
    PRIMARY KEY (employee_id)
);
    /*fk_superior_id              INTEGER         NOT NULL,*/
    /*FOREIGN KEY (fk_superior_id) REFERENCES EMPLOYEE(employee_id)*/

DROP TABLE IF EXISTS ENTRY;
CREATE TABLE ENTRY (
    fk_employee_id              INTEGER         NOT NULL, 
    hours_worked                INTEGER         NOT NULL, 
    hourly_pay                  INTEGER         NOT NULL, 
    PRIMARY KEY (fk_employee_id),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE(employee_id)
);

DROP TABLE IF EXISTS ITEM;
CREATE TABLE ITEM (
    item_id                     INTEGER         NOT NULL, 
    price                       DECIMAL(6,2)    NOT NULL, 
    discount                    INTEGER         NOT NULL, 
    quantity_in_stock           INTEGER         NOT NULL,
    PRIMARY KEY (item_id)
);

DROP TABLE IF EXISTS MANAGER;
CREATE TABLE MANAGER (
    fk_employee_id              INTEGER         NOT NULL, 
    bonus                       INTEGER                 , 
    salary                      INTEGER         NOT NULL,
    PRIMARY KEY (fk_employee_id),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE(employee_id)
);

DROP TABLE IF EXISTS STORE;
CREATE TABLE STORE (
    store_id                    INTEGER         NOT NULL, 
    address                     VARCHAR(200)    NOT NULL,
    city                        VARCHAR(60)     NOT NULL,
    street                      VARCHAR(60)     NOT NULL,
    zipcode                     INTEGER         NOT NULL,
    phone_number                VARCHAR(10)             ,
    regular_hours               DATE            NOT NULL,
    holiday_hours               DATE                    ,
    PRIMARY KEY (store_id)
);


DROP TABLE IF EXISTS WORKS_IN;
CREATE TABLE WORKS_IN (
    fk_department_id            INTEGER         NOT NULL,
    fk_employee_id              INTEGER         NOT NULL,
    PRIMARY KEY (fk_department_id, fk_employee_id),
    FOREIGN KEY (fk_department_id) REFERENCES DEPARTMENT(department_id),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE(employee_id)
);


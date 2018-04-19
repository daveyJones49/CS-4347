DROP DATABASE  IF EXISTS WallmartDB;
CREATE DATABASE IF NOT EXISTS WallmartDB;
USE WallmartDB;

DROP TABLE IF EXISTS STORE;
CREATE TABLE STORE (
    store_id                    INTEGER         NOT NULL, 
    city                        VARCHAR(60)     NOT NULL,
    street                      VARCHAR(60)     NOT NULL,
    zipcode                     INTEGER         NOT NULL,
    phone_number                VARCHAR(10)             ,
    open_time                   VARCHAR(5)        NOT NULL,
    close_time                  VARCHAR(5)      NOT NULL,
    holiday_open                VARCHAR(5)              ,
    holiday_close               VARCHAR(5)               ,
    PRIMARY KEY (store_id)
);

DROP TABLE IF EXISTS EMPLOYEE;
CREATE TABLE EMPLOYEE (  
    employee_id                 INTEGER         NOT NULL,
    name                        VARCHAR(80)     NOT NULL,
    city                        VARCHAR(60)     NOT NULL,
    street                      VARCHAR(60)     NOT NULL,
    zipcode                     INTEGER         NOT NULL,
    phone_number                VARCHAR(10)             ,
    date_of_hire                DATE            NOT NULL,
    shift_number                INTEGER                 ,
    pto_amount                  INTEGER                 ,
    fk_superior_id              INTEGER         		,
    fk_store_id			        INTEGER		    		,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (fk_superior_id) REFERENCES EMPLOYEE (employee_id)
		ON DELETE SET NULL 	ON UPDATE CASCADE,
    FOREIGN KEY (fk_store_id) REFERENCES STORE (store_id)
		ON DELETE SET NULL 	ON UPDATE CASCADE
);

DROP TABLE IF EXISTS CUSTOMER;
CREATE TABLE CUSTOMER (
    reward_card_number                  INTEGER         NOT NULL,
    name                                VARCHAR(50)     NOT NULL,
    phone_number                        VARCHAR(10)             ,
    fk_employee_id                      INTEGER         		, 
    PRIMARY KEY (reward_card_number),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE (employee_id)
		ON DELETE SET NULL 	ON UPDATE CASCADE
);

DROP TABLE IF EXISTS DEPARTMENT;
CREATE TABLE DEPARTMENT (
    department_id               INTEGER         NOT NULL, 
    active_registers            INTEGER                 ,
    craft_station_open          BOOLEAN                 ,
    photo_lab_open				BOOLEAN					,
    date_of_last_inspection     DATE                    ,
    floor_number                INTEGER                 ,
    number_of_freezers          INTEGER                 ,
    department_type             VARCHAR(20)             ,
    total_registers             INTEGER                 ,
    fk_manager_id               INTEGER         		,
    fk_store_id                 INTEGER         		,
    PRIMARY KEY (department_id),
    FOREIGN KEY (fk_manager_id) REFERENCES EMPLOYEE (employee_id)
		ON DELETE SET NULL 	ON UPDATE CASCADE,
    FOREIGN KEY (fk_store_id)   REFERENCES STORE (store_id)
		ON DELETE SET NULL 	ON UPDATE CASCADE
);

DROP TABLE IF EXISTS ENTRY;
CREATE TABLE ENTRY ( 
    hours_worked                INTEGER         NOT NULL, 
    hourly_pay                  INTEGER         NOT NULL, 
    fk_employee_id              INTEGER         		,
    PRIMARY KEY (fk_employee_id),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE (employee_id)
		ON DELETE CASCADE 	ON UPDATE CASCADE
);

DROP TABLE IF EXISTS MANAGER;
CREATE TABLE MANAGER (
    bonus                       INTEGER                 , 
    salary                      INTEGER         NOT NULL,
    fk_employee_id              INTEGER         		, 
    PRIMARY KEY (fk_employee_id),
    FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE (employee_id)
		ON DELETE CASCADE 	ON UPDATE CASCADE
);

DROP TABLE IF EXISTS WORKS_IN;
CREATE TABLE WORKS_IN (
    fk_department_id            INTEGER			NOT NULL,
    fk_employee_id              INTEGER			NOT NULL,
    PRIMARY KEY (fk_department_id, fk_employee_id),
	FOREIGN KEY (fk_department_id) REFERENCES DEPARTMENT (department_id)
        ON DELETE CASCADE	ON UPDATE CASCADE,
	FOREIGN KEY (fk_employee_id) REFERENCES EMPLOYEE (employee_id)
        ON DELETE CASCADE 	ON UPDATE CASCADE
);

DROP TABLE IF EXISTS ITEM;
CREATE TABLE ITEM (
    item_id                     INTEGER         NOT NULL, 
    name			            VARCHAR(50)	    NOT NULL,
    price                       DECIMAL(6,2)    NOT NULL, 
    discount                    INTEGER             	, 
    quantity_in_stock           INTEGER         NOT NULL,
    transaction_id		        INTEGER		    NOT NULL,
    fk_reward_card_number	    INTEGER		    		,
    fk_department_id		    INTEGER		    		,
    PRIMARY KEY (item_id),
    FOREIGN KEY (fk_reward_card_number) REFERENCES CUSTOMER (reward_card_number)
		ON DELETE SET NULL 	ON UPDATE CASCADE,
    FOREIGN KEY (fk_department_id) REFERENCES DEPARTMENT (department_id)
		ON DELETE SET NULL 	ON UPDATE CASCADE
    
);

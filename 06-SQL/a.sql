create database if not exists college;

use college;

create table
    if not exists teacher (
        id int primary key,
        name varchar(50),
        subject varchar(50),
        salary decimal(10)
    );

insert into
    teacher
values
    (23, "ajay", "math", 50000),
    (47, "bharat", "english", 60000),
    (18, "chetan", "chemistry", 45000),
    (9, "divya", "physics", 75000);

select
    *
from
    teacher
where
    salary > 55000;

alter table teacher CHANGE salary ctc float;

UPDATE teacher
SET
    ctc = ctc * 1.25
WHERE
    1 = 1;

alter table teacher
add column city varchar(50) default 'gurgaon';

alter table teacher
drop column ctc;
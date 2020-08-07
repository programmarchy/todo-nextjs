create table todo (
    id serial primary key,
    name text not null,
    description text default null,
    target_completion_date date default null,
    completion_date date default null
);

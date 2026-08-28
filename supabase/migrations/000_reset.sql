-- Run this first to clear out any partial/previous attempt, then re-run 001_init.sql
drop table if exists books cascade;
drop table if exists profiles cascade;
drop function if exists handle_new_user cascade;
drop function if exists set_updated_at cascade;

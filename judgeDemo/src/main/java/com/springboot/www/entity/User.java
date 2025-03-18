package com.springboot.www.entity;

import java.sql.Date;
import java.sql.Timestamp;

public class User {
    private int id;
    private String name;
    private String real_name;
    private String password;
    private String tel;
    private String job;
    private String photo;
    private String sex;
    private String roles;
    private Timestamp created_at;
    private Timestamp updated_at;

    public String getReal_name() {
        return real_name;
    }
    public void setReal_name(String real_name) {
        this.real_name = real_name;
    }
    public String getRoles() {
        return roles;
    }
    public void setRoles(String roles) {
        this.roles = roles;
    }
    public Timestamp getCreated_at() {
        return created_at;
    }
    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }
    public Timestamp getUpdated_at() {
        return updated_at;
    }
    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }
    public int getId(){
        return id;
    }
    public void setId(int id){
        this.id=id;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public String getPassword(){
        return this.password;
    }
    public void setPassword(String password){
        this.password=password;
    }
    public String getTel(){
        return this.tel;
    }
    public void setTel(String tel){
        this.tel=tel;
    }
    public String getJob(){
        return this.job;
    }
    public void setJob(String job){
        this.job=job;
    }
    public String getSex(){
        return this.sex;
    }
    public void setSex(String sex){
        this.sex=sex;
    }
    public String getPhoto(){
        return this.photo;
    }
    public void setPhoto(String photo){
        this.photo=photo;
    }
}

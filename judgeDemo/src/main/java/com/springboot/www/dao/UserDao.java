package com.springboot.www.dao;

import com.springboot.www.entity.Record;
import com.springboot.www.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
@Service
public class UserDao {
    @Autowired(required = false)
    JdbcTemplate jdbcTemplate;

    public int add(User user){
        return jdbcTemplate.update("insert into user(name,real_name,password,tel,job,sex,roles,photo) values(?,?,?,?,?,?,?,?)",
                user.getName(),user.getReal_name(),user.getPassword(),user.getTel(),user.getJob(),user.getSex(),user.getRoles(),"default.jpg");
    }

    public List<User> showAll(){
        List<Map<String,Object>> list=jdbcTemplate.queryForList("select * from user order by roles asc");
        List<User> userList=new ArrayList<>();
        for(Map<String,Object> map:list){
            User user=new User();
            user.setName((String)map.get("name"));
            user.setJob((String)map.get("job"));
            user.setId((int)map.get("id"));
            user.setSex((String) map.get("sex"));
            user.setTel((String)map.get("tel"));
            user.setPhoto((String) map.get("photo"));
            user.setReal_name((String) map.get("real_name"));
            user.setRoles((String) map.get("roles"));
            user.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            user.setUpdated_at(Timestamp.valueOf((LocalDateTime)map.get("updated_at")));
            userList.add(user);
        }
        return userList;
    }

    public User findById(int id){
        List<Map<String,Object>> list=jdbcTemplate.queryForList("select * from user where id=? order by roles asc",id);
        User user=new User();
        if(list.size()>0){
            Map<String,Object> map=list.get(0);
            user.setName((String)map.get("name"));
            user.setPassword((String)map.get("password"));
            user.setJob((String)map.get("job"));
            user.setId((int)map.get("id"));
            user.setSex((String) map.get("sex"));
            user.setTel((String)map.get("tel"));
            user.setPhoto((String) map.get("photo"));
            user.setReal_name((String) map.get("real_name"));
            user.setRoles((String) map.get("roles"));
            user.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            user.setUpdated_at(Timestamp.valueOf((LocalDateTime)map.get("updated_at")));
        }
        return user;
    }

    public int delete(int id){
        return jdbcTemplate.update("delete from user where id=?",id);
    }

    public int update(User user){
        return jdbcTemplate.update("update user set name=?,tel=?,job=?,sex=?,roles=?,real_name=? where id=?",
                user.getName(),user.getTel(),user.getJob(),user.getSex(),user.getRoles(),user.getReal_name(),user.getId());
    }

    public int updatePassword(User user){
        return jdbcTemplate.update("update user set password=? where id=?",
                user.getPassword(),user.getId());
    }

    public int updatePhoto(int uid,String photo){
        return jdbcTemplate.update("update user set photo=? where id=?",
                photo,uid);
    }

    public List<User> find(User user){
        String sql="select * from user";
        boolean flag=true;
        if(user.getName()!=null){
            sql=sql+" where name like '%"+user.getName()+"%'";
            flag=false;
        }
        if(user.getReal_name()!=null){
            if(flag){
                sql=sql+" where ";
            }
            else{
                sql=sql+" and ";
            }
            sql=sql+"real_name = '"+user.getReal_name()+"'";
            flag=false;
        }
        if(user.getRoles()!=null){
            if(flag){
                sql=sql+" where ";
            }
            else{
                sql=sql+" and ";
            }
            sql=sql+"roles = '"+user.getRoles()+"'";
            flag=false;
        }
        if(user.getTel()!=null){
            if(flag){
                sql=sql+" where ";
            }
            else{
                sql=sql+" and ";
            }
            sql=sql+"tel like '%"+user.getTel()+"%'";
            flag=false;
        }
        if(user.getSex()!=null){
            if(flag){
                sql=sql+" where ";
            }
            else{
                sql=sql+" and ";
            }
            sql=sql+"sex = '"+user.getSex()+"'";
        }
        sql=sql+" order by roles asc";
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql);
        List<User> userList=new ArrayList<>();
        for(Map<String,Object> map:list){
            User user1=new User();
            user1.setName((String)map.get("name"));
            user1.setReal_name((String)map.get("real_name"));
            user1.setJob((String)map.get("job"));
            user1.setId((int)map.get("id"));
            user1.setSex((String) map.get("sex"));
            user1.setTel((String)map.get("tel"));
            user1.setRoles((String)map.get("roles"));
            user.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            user.setUpdated_at(Timestamp.valueOf((LocalDateTime)map.get("updated_at")));
            userList.add(user1);
        }
        return userList;
    }

    public User login(String name,String password){
        List<Map<String,Object>> list=jdbcTemplate.queryForList("select * from user where name=? and password=?",
                name,password);
        User user=new User();
        if(list.size()>0){
            for(Map<String,Object> map:list){
                user.setName((String)map.get("name"));
                user.setJob((String)map.get("job"));
                user.setId((int)map.get("id"));
                user.setSex((String) map.get("sex"));
                user.setTel((String)map.get("tel"));
                user.setPhoto((String)map.get("photo"));
                user.setReal_name((String) map.get("real_name"));
                user.setRoles((String) map.get("roles"));
                user.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
                user.setUpdated_at(Timestamp.valueOf((LocalDateTime)map.get("updated_at")));
            }
            return user;
        }
        return null;
    }
}

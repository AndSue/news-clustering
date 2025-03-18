package com.springboot.www.service;

import com.springboot.www.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    int add(User user);
    List<User> showAll();
    //void delete(User user);
    int delete(int id);
    int update(User user);
    int updatePassword(User user);
    int updatePhoto(int uid,String photo);
    List<User> find(User user);
    User findById(int id);
    User login(String name,String password);
    //User getById(String id);
    //List<User> getUsers();
}

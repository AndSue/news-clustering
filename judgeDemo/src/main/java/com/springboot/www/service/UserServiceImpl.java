package com.springboot.www.service;

import com.springboot.www.dao.UserDao;
import com.springboot.www.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserDao userDao=new UserDao();

    @Override
    public int add(User user) {
        return userDao.add(user);
    }

    public List<User> showAll(){
        return userDao.showAll();
    }

    @Override
    public int delete(int id) {
        return userDao.delete(id);
    }

    @Override
    public int update(User user) {
        return userDao.update(user);
    }

    @Override
    public int updatePassword(User user) {
        return userDao.updatePassword(user);
    }

    @Override
    public int updatePhoto(int uid, String photo) {
        return userDao.updatePhoto(uid,photo);
    }

    @Override
    public List<User> find(User user) {
        return userDao.find(user);
    }
    @Override
    public User findById(int id) {
        return userDao.findById(id);
    }
    public User login(String name,String password){
        return userDao.login(name, password);
    }
}

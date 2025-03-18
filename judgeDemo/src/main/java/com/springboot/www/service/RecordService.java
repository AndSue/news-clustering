package com.springboot.www.service;

import com.springboot.www.entity.Record;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RecordService {
    //List<Record> find(Record record);
    List<Record> show(Record record);
    int add(Record record);
    int delete(int id);
    int updateStatus(Record record);
}

package com.rohan.springEcom.controller;


import com.rohan.springEcom.model.dto.OrderRequest;
import com.rohan.springEcom.model.dto.OrderResponse;
import com.rohan.springEcom.service.OrderService;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OrderController {


    @Autowired
    private OrderService orderService;

    @PostMapping("/orders/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest){
        try{
            OrderResponse orderResponse = orderService.placeOrder(orderRequest);
            return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String,String> errorMessage = new HashMap<>();
            errorMessage.put("message",e.getMessage());
            return new ResponseEntity<>(errorMessage,HttpStatus.CONFLICT);
        }


    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders(){
        List<OrderResponse> orders = orderService.getAllOrderResponses();
        return new ResponseEntity<>(orders,HttpStatus.OK);
    }
}

package com.rohan.springEcom.service;


import com.rohan.springEcom.model.Order;
import com.rohan.springEcom.model.OrderItem;
import com.rohan.springEcom.model.Product;
import com.rohan.springEcom.model.dto.OrderItemRequest;
import com.rohan.springEcom.model.dto.OrderItemResponse;
import com.rohan.springEcom.model.dto.OrderRequest;
import com.rohan.springEcom.model.dto.OrderResponse;
import com.rohan.springEcom.repo.OrderRepo;
import com.rohan.springEcom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    ProductRepo productRepo;
    @Autowired
    OrderRepo orderRepo;
    public OrderResponse placeOrder(OrderRequest orderRequest) throws Exception {
        Order order = new Order();
        String orderId ="ODR"+ UUID.randomUUID().toString().substring(0,8).toUpperCase();
        order.setOrderId(orderId);
        order.setCustomerName(orderRequest.customerName());
        order.setEmail(orderRequest.email());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());
        List<OrderItemRequest> items = orderRequest.items();
        List<OrderItem> orderItems = new ArrayList<>();

        for(OrderItemRequest orderItemRequest:items){

            Product product = productRepo.findById(orderItemRequest.productId()).orElseThrow(()-> new RuntimeException("Product Not Found"));
            int quantity = orderItemRequest.quantity();
            if(quantity>product.getStockQuantity()){
                throw new Exception("Stock is limited for the "+product.getName());
            }
            product.setStockQuantity(product.getStockQuantity()-quantity);
            BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            OrderItem item = OrderItem.builder()
                            .product(product)
                                    .quantity(quantity)
                                            .totalPrice(totalPrice)
                                                    .order(order).build();

            productRepo.save(product);
            orderItems.add(item);
        }
        order.setOrderItem(orderItems);

        Order savedOrder = orderRepo.save(order);
        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for(OrderItem item:savedOrder.getOrderItem()){
            OrderItemResponse response = new OrderItemResponse(item.getProduct().getName(),item.getQuantity(),item.getTotalPrice());
            orderItemResponses.add(response);
        }
        return new OrderResponse(
                savedOrder.getOrderId(),
                savedOrder.getCustomerName(),
                savedOrder.getEmail(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate(),
                orderItemResponses
        );
    }

    public List<OrderResponse> getAllOrderResponses(){
        List<Order> orders = orderRepo.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();
        for(Order order:orders){
            List<OrderItemResponse> orderItemResponses = new ArrayList<>();
            for (OrderItem item:order.getOrderItem()){
                orderItemResponses.add(new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalPrice()
                ));
            }
            OrderResponse orderResponse = new OrderResponse(
                    order.getOrderId(),
                    order.getCustomerName(),
                    order.getEmail(),
                    order.getStatus(),
                    order.getOrderDate(),
                    orderItemResponses
            );
            orderResponses.add(orderResponse);
        }
        return orderResponses;
    }
}

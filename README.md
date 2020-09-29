# metrika.js - is observer for web analytics
This is an implementation of the observer pattern for web analytics services.
___
**What problem does it solve?**
If you install multiple web analytics services on your site, you often have multiple handlers for one event. It is difficult to track when an event changes, that in all handlers the code was updated. There's no such problem with this library.

How to set allowed events in an array:
```
metric.events = [
    "view_page_purchase",
    "view_page_home"
]
```

How to set variables in an array:
```
metric.vars = [
    "purchase_order_id",
    "customer_name",
    "customer_email"
];
```

How to set a variable value:
```
metric.var("customer_id", 554);
```

Enable log output in js browser console:
```
metric.debug = true;
```

Subscribe to an event:
```
metric.on('click_checkout', function () {
    fbq('track', 'InitiateCheckout');
}, 'facebook');
```

Using the variable event transmitted at the occurrence of the event:
```
metric.on('basket_product_added', function (data) {
    gtag('event', 'add_to_cart', {
      'event_category': 'ecommerce',
      'event_label': 'Adding product to cart',
      'items': [{
        'id': data.product_id,
        'name': data.name,
        'quantity': 1,
        'list_name': metric.var('category_name'),
        'price': data.price.toFixed(2)
      }]
    })
}, 'Gtag')
```

Notification of an event:
```
metric.notify('authorization');
```

Notification of an event with delay:
```
metric.notify('authorization', [], 3000);
```

Notification of an event with data:
```
metric.notify('authorization', [
    'customer_email' : 'example@example.com'
]);
```

Get the value of a variable:
```
ga_customer_id = metric.var('customer_id'),
```

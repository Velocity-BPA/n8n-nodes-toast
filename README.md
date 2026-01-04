# n8n-nodes-toast

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Toast POS, the leading restaurant point-of-sale and management platform. This node provides complete access to Toast's REST APIs for restaurant operations, order management, menu configuration, labor management, inventory tracking, customer engagement, and reporting.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Toast](https://img.shields.io/badge/Toast-POS-red)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **16 Resource Categories** with 100+ operations
- **OAuth 2.0 Client Credentials** authentication with automatic token management
- **Webhook Trigger Node** for real-time event notifications
- **Multi-Restaurant Support** via Restaurant GUID header
- **Sandbox Environment** support for development and testing
- **Pagination Support** with returnAll option for bulk operations
- **Date Range Filtering** for time-based queries
- **Complete API Coverage** for orders, menus, labor, inventory, customers, and more

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-toast`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-toast
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-toast.git
cd n8n-nodes-toast

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-toast

# Restart n8n
```

## Credentials Setup

To use this node, you'll need Toast API credentials. Contact Toast to become a Toast Integration Partner and obtain API access.

| Field | Description |
|-------|-------------|
| Client ID | Your Toast API Client ID |
| Client Secret | Your Toast API Client Secret |
| Environment | `production` or `sandbox` |
| API Hostname | The API hostname provided by Toast |

### Getting Toast API Access

1. Apply to become a [Toast Technology Partner](https://pos.toasttab.com/partners)
2. Complete the partner onboarding process
3. Receive your API credentials and hostname
4. Configure the credentials in n8n

## Resources & Operations

### Restaurant
- **List Restaurants**: Get all connected restaurants
- **Get Restaurant**: Get restaurant details by GUID
- **Get Restaurant Info**: Get detailed restaurant configuration

### Orders
- **List Orders**: List orders with filters
- **Get Order**: Get order by GUID
- **Create Order**: Create a new order
- **Update Order**: Update an existing order
- **Add Order Item**: Add item to order
- **Remove Order Item**: Remove item from order
- **Void Order**: Void an order
- **Get Order History**: Get order modification history
- **Get Orders by Date Range**: Query orders by date

### Checks
- **List Checks**: List all checks
- **Get Check**: Get check by GUID
- **Create Check**: Create a new check
- **Update Check**: Update check details
- **Apply Discount**: Apply discount to check
- **Remove Discount**: Remove discount from check
- **Apply Service Charge**: Add service charge
- **Print Check**: Send check to printer
- **Close Check**: Close a check

### Payments
- **List Payments**: List all payments
- **Get Payment**: Get payment by GUID
- **Create Payment**: Process a payment
- **Void Payment**: Void a payment
- **Refund Payment**: Process refund
- **Get Tips**: Get tip information

### Menu
- **Get Menu**: Get full menu structure
- **Get Menu Groups**: Get menu group hierarchy
- **Get Menu Items**: Get all menu items
- **Get Menu Item**: Get specific item details
- **Get Modifiers**: Get modifier options
- **Get Modifier Groups**: Get modifier groups
- **Get Pricing**: Get pricing rules
- **Get Menu Images**: Get item images

### Menu Management
- **Create Menu Item**: Add new menu item
- **Update Menu Item**: Update menu item
- **Delete Menu Item**: Remove menu item
- **Create Modifier**: Add new modifier
- **Update Modifier**: Update modifier
- **Update Pricing**: Update pricing rules

### Inventory
- **Get Inventory**: Get inventory levels
- **Update Inventory Quantity**: Adjust stock levels
- **Get Inventory Items**: List inventory items
- **Create Inventory Item**: Add inventory item
- **Update Inventory Item**: Update item details
- **Get Vendors**: List vendors
- **Get Purchase Orders**: List purchase orders

### Labor
- **List Employees**: Get all employees
- **Get Employee**: Get employee details
- **Create Employee**: Add new employee
- **Update Employee**: Update employee info
- **Delete Employee**: Remove employee
- **Get Time Entries**: Get clock records
- **Clock In**: Clock in employee
- **Clock Out**: Clock out employee
- **Get Shifts**: Get scheduled shifts
- **Create Shift**: Schedule a shift
- **Get Breaks**: Get break records
- **Get Labor Costs**: Get labor cost analysis

### Customers (Guests)
- **List Guests**: Get all guest profiles
- **Get Guest**: Get guest details
- **Create Guest**: Create guest profile
- **Update Guest**: Update guest info
- **Get Guest History**: Get visit history
- **Get Guest Loyalty**: Get loyalty info

### Loyalty
- **Get Loyalty Program**: Get program details
- **Get Loyalty Accounts**: List loyalty accounts
- **Get Loyalty Transactions**: Get point history
- **Add Loyalty Points**: Award points
- **Redeem Loyalty Reward**: Redeem a reward

### Tables
- **List Tables**: Get all tables
- **Get Table**: Get table details
- **Get Table Status**: Get current status
- **Update Table Status**: Change table status
- **Get Floor Plan**: Get floor plan layout

### Revenue Centers
- **List Revenue Centers**: Get all revenue centers
- **Get Revenue Center**: Get center details
- **Get Dining Options**: Get dining options

### Cash Management
- **Get Cash Drawers**: List cash drawers
- **Get Cash Drawer Shifts**: Get drawer sessions
- **Get Deposits**: Get deposit records

### Discounts
- **List Discounts**: Get all discounts
- **Get Discount**: Get discount details
- **Create Discount**: Add new discount
- **Update Discount**: Modify discount
- **Delete Discount**: Remove discount

### Reports
- **Get Sales Summary**: Sales overview
- **Get Item Sales**: Item-level sales
- **Get Labor Summary**: Labor analysis
- **Get Payment Summary**: Payment breakdown
- **Get Time Entry Report**: Time tracking report
- **Get Custom Report**: Run custom report

### Configuration
- **Get Service Areas**: List service areas
- **Get Tax Rates**: Get tax configuration
- **Get Alternate Payment Types**: List payment types
- **Get Price Groups**: Get price groups

## Trigger Node

The Toast Trigger node allows you to receive real-time webhooks from Toast for the following events:

| Event | Description |
|-------|-------------|
| Order Created | New order placed |
| Order Paid | Order payment completed |
| Order Completed | Order fulfilled |
| Check Created | New check opened |
| Check Closed | Check closed |
| Payment Processed | Payment transaction completed |
| Menu Item Updated | Menu item modified |
| Employee Clocked In | Employee started shift |
| Employee Clocked Out | Employee ended shift |
| Guest Created | New guest profile created |
| Inventory Low | Inventory below threshold |

### Webhook Setup

1. Add the Toast Trigger node to your workflow
2. Copy the webhook URL from the node
3. Configure the webhook in your Toast Partner portal
4. Set the webhook secret for signature verification

## Usage Examples

### Get Today's Orders

```javascript
// Configure the Toast node with:
// Resource: Orders
// Operation: Get Orders by Date Range
// Restaurant GUID: your-restaurant-guid
// Additional Options:
//   Start Date: {{$today.toISOString()}}
//   End Date: {{$now.toISOString()}}
```

### Create a New Order

```javascript
// Configure the Toast node with:
// Resource: Orders
// Operation: Create Order
// Restaurant GUID: your-restaurant-guid
// Order Data: {
//   "source": "API",
//   "entityType": "Order",
//   "checks": [{
//     "entityType": "Check",
//     "selections": [{
//       "entityType": "MenuItemSelection",
//       "itemGuid": "menu-item-guid",
//       "quantity": 1
//     }]
//   }]
// }
```

### Clock In Employee

```javascript
// Configure the Toast node with:
// Resource: Labor
// Operation: Clock In
// Restaurant GUID: your-restaurant-guid
// Employee GUID: employee-guid
// Job GUID: job-guid (optional)
```

## Toast Concepts

| Concept | Description |
|---------|-------------|
| Restaurant GUID | Unique identifier for each restaurant location |
| Order | A customer transaction containing one or more checks |
| Check | A bill/tab within an order (split checks supported) |
| Dining Option | Service type: dine-in, takeout, delivery |
| Revenue Center | Source/location of orders (bar, dining room, online) |
| Service Area | Physical area (patio, main floor, bar area) |
| Modifier | Item customization option (size, toppings, etc.) |
| Price Group | Time-based pricing (happy hour, lunch special) |
| Guest | Customer profile with visit history |
| Time Entry | Employee clock in/out record |

## API Endpoints Used

| API | Base Path | Description |
|-----|-----------|-------------|
| Authentication | `/authentication/v1/` | OAuth token management |
| Restaurants | `/restaurants/v1/` | Restaurant configuration |
| Orders | `/orders/v2/` | Order management |
| Menus | `/menus/v2/` | Menu configuration |
| Labor | `/labor/v1/` | Employee and scheduling |
| Guests | `/guests/v1/` | Customer profiles |
| Loyalty | `/loyalty/v1/` | Loyalty programs |
| Stock | `/stock/v1/` | Inventory management |
| Config | `/config/v2/` | Restaurant settings |
| Cash Management | `/cashmgmt/v1/` | Cash drawer operations |
| Reporting | `/reporting/v1/` | Analytics and reports |

## Error Handling

The node implements comprehensive error handling:

- **Authentication Errors**: Token refresh and re-authentication
- **Rate Limiting**: Automatic retry with exponential backoff
- **API Errors**: Detailed error messages from Toast API
- **Validation Errors**: Input validation before API calls

## Security Best Practices

1. **Store credentials securely** using n8n's credential management
2. **Use webhook signature verification** to validate incoming webhooks
3. **Limit API access** to required scopes only
4. **Monitor API usage** for unusual patterns
5. **Use sandbox environment** for development and testing

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

- **Documentation**: [Toast API Documentation](https://doc.toasttab.com/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-toast/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [Toast](https://pos.toasttab.com/) for their comprehensive restaurant platform
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for their support and contributions

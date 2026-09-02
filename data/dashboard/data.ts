import { baseURL } from "@/utils/cn";

export const dashboardStats = [
	{
		accentBorder: "border-admin-teal",
		badge: "+ 8.5%",
		badgeClass: "bg-success-50 text-success-600",
		icon: "database",
		iconClass: "bg-success-50 text-admin-teal",
		label: "Total Revenue",
		value: "$6659",
	},
	{
		accentBorder: "border-brand-500",
		badge: "+ 8.5%",
		badgeClass: "bg-brand-50 text-brand-600",
		icon: "archive",
		iconClass: "bg-brand-50 text-brand-600",
		label: "Total Orders",
		value: "9856",
	},
	{
		accentBorder: "border-danger-500",
		badge: "Add new",
		badgeClass: "bg-danger-50 text-danger-500 uppercase tracking-normal",
		icon: "message-circle",
		iconClass: "bg-danger-50 text-danger-500",
		label: "Total Products",
		value: "893",
	},
	{
		accentBorder: "border-purple-500",
		badge: "+ 8.5%",
		badgeClass: "bg-purple-50 text-purple-600",
		icon: "user-plus",
		iconClass: "bg-purple-50 text-purple-600",
		label: "Total Customers",
		value: "4.6k",
	},
];

export const dashboardCategories = [
	["Headphones", "/assets/images/catagory-img/cat-bg-headphones-01.webp"],
	["Charging Cable", "/assets/images/catagory-img/cat-transp-img-01.webp"],
	["Power Adapter", "/assets/images/catagory-img/cat-transp-img-02.webp"],
	["Power Bank", "/assets/images/catagory-img/cat-transp-img-03.webp"],
	[
		"Bluetooth Speaker",
		"/assets/images/catagory-img/cat-bg-headphones-02.webp",
	],
	["Mini Speaker", "/assets/images/catagory-img/cat-bg-headphones-03.webp"],
	["Smart Watch", "/assets/images/catagory-img/cat-transp-img-08.webp"],
	["Smart TV", "/assets/images/catagory-img/cat-transp-img-09.webp"],
	["Wireless Headphones", "/assets/images/catagory-img/cat-transp-img-10.webp"],
	["Portable Speaker", "/assets/images/catagory-img/cat-bg-headphones-04.webp"],
	["Microphone", "/assets/images/catagory-img/cat-bg-headphones-05.webp"],
	["Over-Ear Headphones", "/assets/images/catagory-img/cat-transp-img-06.webp"],
	["Camera", "/assets/images/catagory-img/cat-transp-img-07.webp"],
	["Tablet", "/assets/images/catagory-img/cat-transp-img-11.webp"],
	["Gaming Mouse", "/assets/images/catagory-img/cat-transp-img-12.webp"],
].map(([label, image]) => ({
	image: `${baseURL}${image.replace(/^\//, "")}`,
	label,
}));

export const topProducts = [
	{
		amount: "$1,798",
		date: "26-08-2026",
		image: `${baseURL}assets/images/products/organic-food-a-01.webp`,
		name: "Organic Food Pack",
		orders: "62",
		price: "$29.00",
		stock: "510",
	},
	{
		amount: "$1,152",
		date: "26-08-2026",
		image: `${baseURL}assets/images/products/bakery-product-img-02.webp`,
		name: "Bakery Breakfast Box",
		orders: "48",
		price: "$24.00",
		stock: "320",
	},
	{
		amount: "$1,404",
		date: "26-08-2026",
		image: `${baseURL}assets/images/products/coffee-b-01.webp`,
		name: "Premium Coffee Pack",
		orders: "39",
		price: "$36.00",
		stock: "188",
	},
];

export const topCategories = [
	{
		colorClass: "bg-brand-600",
		label: "Grocery",
		percent: 38,
		value: "$24.5k",
	},
	{
		colorClass: "bg-admin-teal",
		label: "Bakery",
		percent: 25,
		value: "$16.2k",
	},
	{
		colorClass: "bg-accent-500",
		label: "Drinks",
		percent: 18,
		value: "$11.8k",
	},
	{ colorClass: "bg-purple-500", label: "Snacks", percent: 12, value: "$8.1k" },
	{ colorClass: "bg-warning-500", label: "Dairy", percent: 7, value: "$4.6k" },
];

export const recentOrders = [
	{
		id: "#64548",
		name: "Almond Milk",
		date: "5/1/22",
		price: "$250.00",
		status: "Completed",
		statusClass: "text-success-600",
		payment: "Unpaid",
		paymentClass: "text-danger-500",
	},
	{
		id: "#64549",
		name: "Potato Chips",
		date: "5/1/22",
		price: "$250.00",
		status: "Completed",
		statusClass: "text-success-600",
		payment: "Paid",
		paymentClass: "text-success-600",
	},
	{
		id: "#64550",
		name: "Fresh Meat",
		date: "5/1/22",
		price: "$250.00",
		status: "Completed",
		statusClass: "text-success-600",
		payment: "Paid",
		paymentClass: "text-success-600",
	},
	{
		id: "#64551",
		name: "Classic Coffee",
		date: "5/1/22",
		price: "$250.00",
		status: "Pending",
		statusClass: "text-warning-600",
		payment: "Paid",
		paymentClass: "text-success-600",
	},
];

export const transactions = [
	{
		amount: "-$74",
		amountClass: "text-danger-500",
		icon: "shield",
		iconClass: "bg-danger-50 text-danger-500",
		label: "Wallets",
		meta: "Starbucks",
	},
	{
		amount: "+$125",
		amountClass: "text-success-600",
		icon: "check",
		iconClass: "bg-success-50 text-success-600",
		label: "Bank Transfer",
		meta: "Add Money",
	},
	{
		amount: "-$50",
		amountClass: "text-danger-500",
		icon: "dollar-sign",
		iconClass: "bg-brand-50 text-brand-600",
		label: "Paypal",
		meta: "Add Money",
	},
	{
		amount: "-$40",
		amountClass: "text-danger-500",
		icon: "credit-card",
		iconClass: "bg-warning-50 text-warning-600",
		label: "Mastercard",
		meta: "Ordered Food",
	},
	{
		amount: "+$90",
		amountClass: "text-success-600",
		icon: "bar-chart-3",
		iconClass: "bg-purple-50 text-purple-600",
		label: "Transfer",
		meta: "Refund",
	},
];

export const initialTasks = [
	{ id: "school", time: "8 Hours", title: "Pick up kids from school" },
	{ id: "presentation", time: "8 Hours", title: "Prepare for presentation" },
	{ id: "invoice", time: "8 Hours", title: "Create invoice" },
	{ id: "alisa", time: "8 Hours", title: "Meeting with Alisa" },
];

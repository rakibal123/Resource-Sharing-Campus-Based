
export const resources = [
    {
        _id: '1',
        title: 'Advanced Calculus Textbook',
        category: 'Books',
        description: 'A comprehensive guide to calculus for engineering students. Includes problem sets and solutions.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3',
        owner: {
            _id: 'u1',
            name: 'John Doe',
            email: 'john@example.com',
        },
    },
    {
        _id: '2',
        title: 'Arduino Starter Kit',
        category: 'Electronics',
        description: 'Complete kit for beginners. Includes Arduino Uno, sensors, LEDs, and jumper wires.',
        status: 'Borrowed',
        imageUrl: 'https://images.unsplash.com/photo-1555664424-778a69631079?auto=format&fit=crop&q=80&w=2592&ixlib=rb-4.0.3',
        owner: {
            _id: 'u2',
            name: 'Jane Smith',
            email: 'jane@example.com',
        },
    },
    {
        _id: '3',
        title: 'Graphing Calculator',
        category: 'Electronics',
        description: 'TI-84 Plus CE graphing calculator. Perfect for math and science classes.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1585338107529-13f953b6f280?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3',
        owner: {
            _id: 'u3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
        },
    },
    {
        _id: '4',
        title: 'Lab Coat (Size M)',
        category: 'Clothing',
        description: 'Standard white lab coat, size medium. Gently used, clean.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3',
        owner: {
            _id: 'u1',
            name: 'John Doe',
            email: 'john@example.com',
        },
    },
    {
        _id: '5',
        title: 'Physics Notes (Sem 1)',
        category: 'Notes',
        description: 'Handwritten notes for Physics 101. Covers mechanics and thermodynamics.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1456735190827-d1261f7add50?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3',
        owner: {
            _id: 'u2',
            name: 'Jane Smith',
            email: 'jane@example.com',
        },
    }
];

export const requests = [
    {
        _id: 'r1',
        resource: resources[1],
        borrower: { _id: 'u1', name: 'John Doe' },
        status: 'Pending',
        date: '2023-10-25',
    },
    {
        _id: 'r2',
        resource: resources[2],
        borrower: { _id: 'u4', name: 'Alice Brown' },
        status: 'Approved',
        date: '2023-10-20',
    },
];

export const currentUser = {
    _id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Student', // or 'Admin'
};

export const users = [
    {
        _id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        department: 'CSE',
        role: 'Student',
        status: 'Active',
    },
    {
        _id: 'u2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'EEE',
        role: 'Faculty',
        status: 'Active',
    },
    {
        _id: 'u3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        department: 'BBA',
        role: 'Student',
        status: 'Blocked',
    },
    {
        _id: 'u4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        department: 'LAW',
        role: 'Student',
        status: 'Active',
    },
    {
        _id: 'u5',
        name: 'Robert Wilson',
        email: 'robert@example.com',
        department: 'CSE',
        role: 'Admin',
        status: 'Active',
    },
];

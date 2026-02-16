'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, use } from 'react';
import Header2 from '@/components/Header2';

// Define interface for Course Details
interface CourseDetail {
  title: string;
  description: string;
  content: {
    headings: string[];
    descriptions: string[];
  };
  botpressUrl?: string; // Optional
}

const courseDetails: Record<number, CourseDetail> = {
  1: {
    title: 'Web Development Course',
    description:
      'Web Development courses teach fundamental skills for creating and maintaining websites. They cover topics like building functional sites, web design principles, and UX/UI design.',
    content: {
      headings: ['1. HTML', '2. CSS', '3. JavaScript', '4. Version Control', '5. Frameworks', '6. Deployment'],
      descriptions: [
        'Forms, input types, and Accessibility.',
        'Selectors, Box model, Flexbox/Grid, and Responsive design.',
        'DOM manipulation, Event handling, and Async/Await.',
        'Git basics and GitHub usage.',
        'React, Vue, or Tailwind CSS basics.',
        'Netlify, Vercel, and Domain basics.',
      ],
    },
    botpressUrl:
      'https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/02/16/20250202160648-VCUOL1UL.json',
  },
  2: {
    title: 'App Development Course',
    description: 'Learn to build mobile and desktop applications with modern frameworks.',
    content: {
      headings: ['1. React Native', '2. Flutter', '3. Native Development', '4. State Management', '5. Backend Integration', '6. Deployment'],
      descriptions: [
        'Cross-platform mobile development with React.',
        'Beautiful native applications from a single codebase.',
        'iOS and Android native development.',
        'Managing application state effectively.',
        'Connecting apps to backend services.',
        'Publishing apps to app stores.',
      ],
    },
    botpressUrl:
      'https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/02/16/20250202160648-VCUOL1UL.json',
  },
  3: {
    title: 'UI/UX Design Course',
    description: 'Master the art of creating beautiful and user-friendly interfaces.',
    content: {
      headings: ['1. Design Principles', '2. Color Theory', '3. Typography', '4. Wireframing', '5. Prototyping', '6. User Testing'],
      descriptions: [
        'Fundamental design principles and concepts.',
        'Understanding color psychology and palettes.',
        'Choosing and working with typefaces.',
        'Creating low-fidelity mockups.',
        'Building interactive prototypes.',
        'Testing designs with real users.',
      ],
    },
    botpressUrl:
      'https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/02/16/20250202160648-VCUOL1UL.json',
  },
  4: {
    title: 'Data Science Course',
    description: 'Learn to analyze data and build machine learning models.',
    content: {
      headings: ['1. Python Basics', '2. Data Analysis', '3. Visualization', '4. Machine Learning', '5. Deep Learning', '6. Deployment'],
      descriptions: [
        'Python programming fundamentals.',
        'Working with pandas and numpy.',
        'Creating visualizations with matplotlib.',
        'Building ML models with scikit-learn.',
        'Neural networks and TensorFlow.',
        'Deploying ML models to production.',
      ],
    },
    botpressUrl:
      'https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/02/16/20250202160648-VCUOL1UL.json',
  },
  5: {
    title: 'Web Development Roadmap',
    description: 'A comprehensive roadmap to becoming a skilled web developer.',
    content: {
      headings: ['1. HTML', '2. CSS', '3. JavaScript', '4. Version Control', '5. Frameworks', '6. Deployment'],
      descriptions: [
        'Forms, input types, and Accessibility.',
        'Selectors, Box model, Flexbox/Grid, and Responsive design.',
        'DOM manipulation, Event handling, and Async/Await.',
        'Git basics and GitHub usage.',
        'React, Vue, or Tailwind CSS basics.',
        'Netlify, Vercel, and Domain basics.',
      ],
    },
  },
  6: {
    title: 'App Development Roadmap',
    description: 'A step-by-step guide to mastering mobile application development.',
    content: {
      headings: ['1. React Native', '2. Flutter', '3. Native Development', '4. State Management', '5. Backend Integration', '6. Deployment'],
      descriptions: [
        'Cross-platform mobile development with React.',
        'Beautiful native applications from a single codebase.',
        'iOS and Android native development.',
        'Managing application state effectively.',
        'Connecting apps to backend services.',
        'Publishing apps to app stores.',
      ],
    },
  },
  7: {
    title: 'UI/UX Design Roadmap',
    description: 'Your path to becoming a professional UI/UX designer.',
    content: {
      headings: ['1. Design Principles', '2. Color Theory', '3. Typography', '4. Wireframing', '5. Prototyping', '6. User Testing'],
      descriptions: [
        'Fundamental design principles and concepts.',
        'Understanding color psychology and palettes.',
        'Choosing and working with typefaces.',
        'Creating low-fidelity mockups.',
        'Building interactive prototypes.',
        'Testing designs with real users.',
      ],
    },
  },
  8: {
    title: 'Data Science Roadmap',
    description: 'The complete journey to becoming a data scientist.',
    content: {
      headings: ['1. Python Basics', '2. Data Analysis', '3. Visualization', '4. Machine Learning', '5. Deep Learning', '6. Deployment'],
      descriptions: [
        'Python programming fundamentals.',
        'Working with pandas and numpy.',
        'Creating visualizations with matplotlib.',
        'Building ML models with scikit-learn.',
        'Neural networks and TensorFlow.',
        'Deploying ML models to production.',
      ],
    },
  },
};

import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showChat, setShowChat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const courseId = parseInt(id);
  const course = courseDetails[courseId as keyof typeof courseDetails];

  if (!course) {
    return (
      <div>
        <Header />
        <div className="max-w-[85vw] mx-auto py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <Link href="/">
            <button className="bg-[#FF6643] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e65c00] transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initiatePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Order
      const res = await fetch('https://eduskill-1.onrender.com/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 499, // Example amount
          name: course.title,
          description: `Access to ${course.title} Chatbot`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert('Something went wrong while creating order');
        setIsProcessing(false);
        return;
      }

      // 2. Initialize Razorpay
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Eduskill',
        description: data.description,
        order_id: data.order_id,
        handler: function (response: any) {
          // Payment Success
          // In a real app, verify signature on backend here
          console.log('Payment Successful', response);
          setShowChat(true);
          setIsProcessing(false);
        },
        prefill: {
          name: 'Eduskill User',
          email: 'user@eduskill.com',
          contact: '9999999999',
        },
        theme: {
          color: '#FF6643',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            alert('Payment Cancelled');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        alert('Payment Failed: ' + response.error.description);
        setIsProcessing(false);
      });

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Failed to initiate payment. Please check your network connection.');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Header2 />
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <main className="max-w-[85vw] mx-auto py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
            {course.description}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-orange-100 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-[#FF6643] pl-4">
            Content to learn
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-700 leading-loose">
            <div>
              {course.content.headings.slice(0, 3).map((heading, index) => (
                <p key={index} className="mb-4">
                  <strong>{heading}</strong>: {course.content.descriptions[index]}
                </p>
              ))}
            </div>
            <div>
              {course.content.headings.slice(3).map((heading, index) => (
                <p key={index + 3} className="mb-4">
                  <strong>{heading}</strong>:{' '}
                  {course.content.descriptions[index + 3]}
                </p>
              ))}
            </div>
          </div>
        </div>

        {course.botpressUrl && !showChat && (
          <div className="flex justify-center py-10">
            <button
              onClick={initiatePayment}
              disabled={isProcessing}
              className="px-12 py-5 bg-[#FF6643] text-white text-xl font-bold rounded-2xl hover:bg-[#e65c00] transition-all shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Buy ${course.title.replace(' Course', '')} Chatbot`}
            </button>
          </div>
        )}

        {course.botpressUrl && showChat && (
          <div className="mt-10 animate-fade-in">
            <div className="p-4 bg-green-100 text-green-700 rounded-xl mb-4 text-center font-bold border border-green-300">
              Payment Successful! Chatbot Unlocked.
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <iframe
                src={course.botpressUrl}
                frameBorder="0"
                className="w-full h-[600px]"
              ></iframe>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Initialize your app
var myApp = new Framework7 ({
   animateNavBackIcon: true,
   
   // Enable templates auto precompilation
   precompileTemplates: true,
   
   // Enabled rendering pages using Template7
   template7Pages: true,
   
   // Specify Template7 data for pages
   template7Data: {
      //provides the url for different page with data-page = "likes"
      'url:likes.html': {
         likes: [
            {
               title: 'Nelson Mandela',
               description: 'Champion of Freedom'
            },
            
            {
               title: 'Srinivasa Ramanujan',
               description: 'The Man Who Knew Infinity'
            },
            
            {
               title: 'James Cameron',
               description: 'Famous Filmmaker'
            }
         ]
      },
      about: {
         firstname: 'William ',
         lastname: 'Root',
         age: 27,
         position: 'Developer',
         company: 'TechShell',
      }
   }
});

// Add main View
var mainView = myApp.addView('.view-main', {
   // Enable dynamic Navbar
   dynamicNavbar: true
});
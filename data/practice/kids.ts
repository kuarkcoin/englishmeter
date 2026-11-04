import type { PracticeTest } from './types';

export const kidsTests: readonly PracticeTest[] = [
  {
    slug: 'colours', category: 'kids', level: 'Starter', title: 'Colours', duration: 10,
    description: 'Learn English colour words with short sentences and simple paint-mixing questions.',
    learningGoals: ['Recognise colour words', 'Read simple colour descriptions', 'Name familiar paint colours'],
    questions: [
      {
        id: 'kids-colours-01', prompt: 'Which word is a colour?',
        options: ['table', 'blue', 'book', 'dog'], correctIndex: 1,
        explanation: 'Blue is a colour. Table, book and dog name things or animals.',
      },
      {
        id: 'kids-colours-02', prompt: 'The ball is red. What colour is the ball?',
        options: ['green', 'yellow', 'black', 'red'], correctIndex: 3,
        explanation: 'The sentence tells us that the ball is red.',
      },
      {
        id: 'kids-colours-03', prompt: 'Which colour word starts with the letter g?',
        options: ['green', 'pink', 'blue', 'red'], correctIndex: 0,
        explanation: 'Green starts with g: g-r-e-e-n.',
      },
      {
        id: 'kids-colours-04', prompt: 'Leo has a yellow kite. His bag is purple. What colour is his kite?',
        options: ['purple', 'white', 'yellow', 'brown'], correctIndex: 2,
        explanation: 'The kite is yellow. Purple describes the bag.',
      },
      {
        id: 'kids-colours-05', prompt: 'Which colour do red and yellow paint make when mixed?',
        options: ['orange', 'blue', 'white', 'grey'], correctIndex: 0,
        explanation: 'Mixing red paint and yellow paint makes orange.',
      },
      {
        id: 'kids-colours-06', prompt: 'Which colour do blue and yellow paint make when mixed?',
        options: ['pink', 'red', 'purple', 'green'], correctIndex: 3,
        explanation: 'Mixing blue paint and yellow paint makes green.',
      },
      {
        id: 'kids-colours-07', prompt: 'Which colour do red and blue paint make when mixed?',
        options: ['yellow', 'purple', 'white', 'orange'], correctIndex: 1,
        explanation: 'Mixing red paint and blue paint makes purple.',
      },
      {
        id: 'kids-colours-08', prompt: 'Which colour do black and white paint make when mixed?',
        options: ['green', 'orange', 'grey', 'red'], correctIndex: 2,
        explanation: 'Mixing black paint and white paint makes grey.',
      },
      {
        id: 'kids-colours-09', prompt: 'Which colour do red and white paint make when mixed?',
        options: ['pink', 'brown', 'blue', 'black'], correctIndex: 0,
        explanation: 'White paint makes red lighter. Together they make pink.',
      },
      {
        id: 'kids-colours-10', prompt: 'Mina has a brown bag and a black hat. What colour is her hat?',
        options: ['brown', 'green', 'yellow', 'black'], correctIndex: 3,
        explanation: 'Mina’s hat is black. Her bag is brown.',
      },
    ],
  },
  {
    slug: 'animals', category: 'kids', level: 'Starter', title: 'Animals', duration: 10,
    description: 'Match familiar animals to their sounds, body parts and simple descriptions.',
    learningGoals: ['Learn animal names', 'Match animals to familiar sounds', 'Read short animal clues'],
    questions: [
      {
        id: 'kids-animals-01', prompt: 'Which animal says “meow”?',
        options: ['dog', 'cow', 'cat', 'duck'], correctIndex: 2,
        explanation: 'A cat says “meow”. That is the English word for this cat sound.',
      },
      {
        id: 'kids-animals-02', prompt: 'Which animal says “woof”?',
        options: ['dog', 'fish', 'sheep', 'bee'], correctIndex: 0,
        explanation: 'A dog says “woof”. Dogs bark.',
      },
      {
        id: 'kids-animals-03', prompt: 'Which animal has a long trunk?',
        options: ['rabbit', 'tiger', 'duck', 'elephant'], correctIndex: 3,
        explanation: 'An elephant has a long trunk. It uses its trunk to smell and pick things up.',
      },
      {
        id: 'kids-animals-04', prompt: 'Which animal has a very long neck?',
        options: ['cat', 'giraffe', 'bee', 'fish'], correctIndex: 1,
        explanation: 'A giraffe has a very long neck. It can reach leaves high in trees.',
      },
      {
        id: 'kids-animals-05', prompt: 'Which animal swims with fins?',
        options: ['sheep', 'dog', 'fish', 'rabbit'], correctIndex: 2,
        explanation: 'A fish has fins that help it swim in water.',
      },
      {
        id: 'kids-animals-06', prompt: 'Which animal has feathers?',
        options: ['duck', 'cat', 'fish', 'rabbit'], correctIndex: 0,
        explanation: 'A duck is a bird. Birds have feathers.',
      },
      {
        id: 'kids-animals-07', prompt: 'Which small animal has long ears and hops?',
        options: ['bee', 'fish', 'duck', 'rabbit'], correctIndex: 3,
        explanation: 'A rabbit has long ears and moves by hopping.',
      },
      {
        id: 'kids-animals-08', prompt: 'Which insect makes honey?',
        options: ['butterfly', 'bee', 'ant', 'fly'], correctIndex: 1,
        explanation: 'Honey bees make honey. A bee is an insect.',
      },
      {
        id: 'kids-animals-09', prompt: 'Which farm animal grows wool?',
        options: ['duck', 'horse', 'sheep', 'hen'], correctIndex: 2,
        explanation: 'Sheep grow wool. People can use wool to make warm clothes.',
      },
      {
        id: 'kids-animals-10', prompt: 'Which animal is a big cat with stripes?',
        options: ['tiger', 'monkey', 'rabbit', 'cow'], correctIndex: 0,
        explanation: 'A tiger is a big cat. It has stripes on its fur.',
      },
    ],
  },
  {
    slug: 'numbers', category: 'kids', level: 'Starter', title: 'Numbers', duration: 10,
    description: 'Read English number words from one to twenty and practise easy counting.',
    learningGoals: ['Match words to numbers', 'Put small numbers in order', 'Count with simple English sentences'],
    questions: [
      {
        id: 'kids-numbers-01', prompt: 'Which word means 3?',
        options: ['four', 'three', 'six', 'seven'], correctIndex: 1,
        explanation: 'We write the number 3 as three.',
      },
      {
        id: 'kids-numbers-02', prompt: 'Which number comes after five?',
        options: ['seven', 'four', 'two', 'six'], correctIndex: 3,
        explanation: 'The order is four, five, six. Six comes after five.',
      },
      {
        id: 'kids-numbers-03', prompt: 'Two apples and one apple make ___ apples.',
        options: ['three', 'one', 'four', 'five'], correctIndex: 0,
        explanation: 'Two plus one is three. There are three apples.',
      },
      {
        id: 'kids-numbers-04', prompt: 'Which word means 10?',
        options: ['two', 'twelve', 'ten', 'twenty'], correctIndex: 2,
        explanation: 'We write the number 10 as ten.',
      },
      {
        id: 'kids-numbers-05', prompt: 'Which number comes just before nine?',
        options: ['ten', 'eight', 'six', 'eleven'], correctIndex: 1,
        explanation: 'The order is seven, eight, nine. Eight comes just before nine.',
      },
      {
        id: 'kids-numbers-06', prompt: 'Which word means 12?',
        options: ['twenty', 'two', 'ten', 'twelve'], correctIndex: 3,
        explanation: 'We write the number 12 as twelve.',
      },
      {
        id: 'kids-numbers-07', prompt: 'Which number is bigger: four or seven?',
        options: ['seven', 'four', 'two', 'one'], correctIndex: 0,
        explanation: 'Seven is bigger than four: 7 is more than 4.',
      },
      {
        id: 'kids-numbers-08', prompt: 'Five stars and five stars make ___ stars.',
        options: ['five', 'six', 'ten', 'nine'], correctIndex: 2,
        explanation: 'Five plus five is ten. There are ten stars.',
      },
      {
        id: 'kids-numbers-09', prompt: 'Which word means 20?',
        options: ['twelve', 'twenty', 'two', 'ten'], correctIndex: 1,
        explanation: 'We write the number 20 as twenty.',
      },
      {
        id: 'kids-numbers-10', prompt: 'Complete the list: eleven, twelve, ___.',
        options: ['nine', 'ten', 'fifteen', 'thirteen'], correctIndex: 3,
        explanation: 'Thirteen comes after twelve: 11, 12, 13.',
      },
    ],
  },
  {
    slug: 'family', category: 'kids', level: 'Starter', title: 'Family', duration: 10,
    description: 'Learn family words through short stories about children and their relatives.',
    learningGoals: ['Recognise family words', 'Understand simple family relationships', 'Read short family descriptions'],
    questions: [
      {
        id: 'kids-family-01', prompt: 'Another word for mum is ___.',
        options: ['uncle', 'brother', 'father', 'mother'], correctIndex: 3,
        explanation: 'Mum means mother. Mom is another spelling used in American English.',
      },
      {
        id: 'kids-family-02', prompt: 'Another word for dad is ___.',
        options: ['father', 'sister', 'aunt', 'daughter'], correctIndex: 0,
        explanation: 'Dad is a friendly word for father.',
      },
      {
        id: 'kids-family-03', prompt: 'Eva and Ben have the same parents. Ben is a boy. He is Eva’s ___.',
        options: ['sister', 'grandmother', 'brother', 'aunt'], correctIndex: 2,
        explanation: 'Ben is Eva’s brother. Brother is the word for a boy sibling.',
      },
      {
        id: 'kids-family-04', prompt: 'Ana and Tom have the same parents. Ana is a girl. She is Tom’s ___.',
        options: ['uncle', 'sister', 'father', 'grandfather'], correctIndex: 1,
        explanation: 'Ana is Tom’s sister. Sister is the word for a girl sibling.',
      },
      {
        id: 'kids-family-05', prompt: 'Maya’s mother has a mother called Rose. Rose is Maya’s ___.',
        options: ['brother', 'son', 'uncle', 'grandmother'], correctIndex: 3,
        explanation: 'The mother of your parent is your grandmother.',
      },
      {
        id: 'kids-family-06', prompt: 'Noah’s father has a father called Ali. Ali is Noah’s ___.',
        options: ['grandfather', 'sister', 'daughter', 'aunt'], correctIndex: 0,
        explanation: 'The father of your parent is your grandfather.',
      },
      {
        id: 'kids-family-07', prompt: 'Sara is the sister of Leo’s mother. Sara is Leo’s ___.',
        options: ['father', 'brother', 'aunt', 'son'], correctIndex: 2,
        explanation: 'The sister of your parent is your aunt.',
      },
      {
        id: 'kids-family-08', prompt: 'Sam is the brother of Mina’s father. Sam is Mina’s ___.',
        options: ['daughter', 'uncle', 'sister', 'mother'], correctIndex: 1,
        explanation: 'The brother of your parent is your uncle.',
      },
      {
        id: 'kids-family-09', prompt: 'Lina is the child of Omar’s aunt. Lina is Omar’s ___.',
        options: ['father', 'grandmother', 'mother', 'cousin'], correctIndex: 3,
        explanation: 'A child of your aunt or uncle is your cousin.',
      },
      {
        id: 'kids-family-10', prompt: 'A grandmother and a grandfather are ___.',
        options: ['grandparents', 'brothers', 'sisters', 'children'], correctIndex: 0,
        explanation: 'Grandparents is the word for grandmothers and grandfathers together.',
      },
    ],
  },
  {
    slug: 'school', category: 'kids', level: 'Starter', title: 'School', duration: 10,
    description: 'Practise words for classroom objects, school activities and simple instructions.',
    learningGoals: ['Name classroom objects', 'Understand school action words', 'Follow short classroom instructions'],
    questions: [
      {
        id: 'kids-school-01', prompt: 'Which thing can you use to write on paper?',
        options: ['chair', 'shoe', 'pencil', 'plate'], correctIndex: 2,
        explanation: 'You can write or draw on paper with a pencil.',
      },
      {
        id: 'kids-school-02', prompt: 'Which thing helps you draw a straight line?',
        options: ['ruler', 'bag', 'hat', 'cup'], correctIndex: 0,
        explanation: 'A ruler has a straight edge. You can draw a line along it.',
      },
      {
        id: 'kids-school-03', prompt: 'Which thing removes a pencil mark from paper?',
        options: ['book', 'desk', 'clock', 'eraser'], correctIndex: 3,
        explanation: 'An eraser removes pencil marks. It is also called a rubber in British English.',
      },
      {
        id: 'kids-school-04', prompt: 'Which word means a person who helps pupils learn?',
        options: ['window', 'teacher', 'pencil', 'playground'], correctIndex: 1,
        explanation: 'A teacher helps pupils learn at school.',
      },
      {
        id: 'kids-school-05', prompt: 'You carry your books to school in a ___.',
        options: ['spoon', 'sock', 'schoolbag', 'plate'], correctIndex: 2,
        explanation: 'A schoolbag holds books and other things you need at school.',
      },
      {
        id: 'kids-school-06', prompt: '“Open your book.” What should you open?',
        options: ['your book', 'the window', 'your bag', 'the door'], correctIndex: 0,
        explanation: 'The instruction asks you to open your book.',
      },
      {
        id: 'kids-school-07', prompt: 'Which thing tells you the time on the classroom wall?',
        options: ['map', 'picture', 'shelf', 'clock'], correctIndex: 3,
        explanation: 'A clock tells you the time.',
      },
      {
        id: 'kids-school-08', prompt: '“Please sit down.” What should you do?',
        options: ['stand up', 'take a seat', 'open a book', 'close a door'], correctIndex: 1,
        explanation: 'Sit down means take a seat, for example on a chair.',
      },
      {
        id: 'kids-school-09', prompt: 'Which word means to look at words and understand them?',
        options: ['run', 'jump', 'read', 'sleep'], correctIndex: 2,
        explanation: 'When you read, you look at words and understand their meaning.',
      },
      {
        id: 'kids-school-10', prompt: 'The children play outside at school. They are in the ___.',
        options: ['playground', 'kitchen', 'bedroom', 'bathroom'], correctIndex: 0,
        explanation: 'A playground is a place where children can play at school.',
      },
    ],
  },
  {
    slug: 'food', category: 'kids', level: 'Starter', title: 'Food', duration: 10,
    description: 'Learn simple English words for fruit, vegetables, drinks and meals.',
    learningGoals: ['Recognise familiar food words', 'Name simple drinks and meals', 'Read short sentences about food'],
    questions: [
      {
        id: 'kids-food-01', prompt: 'Which one is a fruit?',
        options: ['bread', 'apple', 'rice', 'cheese'], correctIndex: 1,
        explanation: 'An apple is a fruit. It grows on a tree.',
      },
      {
        id: 'kids-food-02', prompt: 'Which one is a vegetable?',
        options: ['banana', 'milk', 'bread', 'carrot'], correctIndex: 3,
        explanation: 'A carrot is a vegetable. The part we eat grows under the ground.',
      },
      {
        id: 'kids-food-03', prompt: 'Which one is a drink?',
        options: ['water', 'sandwich', 'potato', 'apple'], correctIndex: 0,
        explanation: 'Water is something we drink.',
      },
      {
        id: 'kids-food-04', prompt: 'Which meal do people usually eat in the morning?',
        options: ['dinner', 'lunch', 'breakfast', 'dessert'], correctIndex: 2,
        explanation: 'Breakfast is the meal usually eaten in the morning.',
      },
      {
        id: 'kids-food-05', prompt: 'Ella puts cheese between two slices of bread. She makes a ___.',
        options: ['soup', 'sandwich', 'salad', 'drink'], correctIndex: 1,
        explanation: 'A sandwich has food between slices of bread.',
      },
      {
        id: 'kids-food-06', prompt: 'Leo eats warm soup from a ___.',
        options: ['schoolbag', 'shoe', 'hat', 'bowl'], correctIndex: 3,
        explanation: 'A bowl is a dish that can hold soup.',
      },
      {
        id: 'kids-food-07', prompt: 'Mia wants a drink made from oranges. She asks for ___.',
        options: ['orange juice', 'apple juice', 'water', 'milk'], correctIndex: 0,
        explanation: 'Orange juice is a drink made from oranges.',
      },
      {
        id: 'kids-food-08', prompt: 'Which word names a frozen sweet food?',
        options: ['bread', 'rice', 'ice cream', 'carrot'], correctIndex: 2,
        explanation: 'Ice cream is a sweet food that is kept frozen.',
      },
      {
        id: 'kids-food-09', prompt: 'Sam is thirsty. He wants to ___.',
        options: ['read', 'drink', 'draw', 'sleep'], correctIndex: 1,
        explanation: 'When you are thirsty, you need something to drink.',
      },
      {
        id: 'kids-food-10', prompt: 'A banana, an apple and a pear are all ___.',
        options: ['drinks', 'vegetables', 'sandwiches', 'fruits'], correctIndex: 3,
        explanation: 'Bananas, apples and pears are different kinds of fruit.',
      },
    ],
  },
];

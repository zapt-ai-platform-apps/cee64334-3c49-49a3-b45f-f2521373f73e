import { useNavigate } from '@solidjs/router';

function Home(props) {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div class="h-full flex flex-col justify-center items-center text-center">
      <h1 class="text-4xl font-bold text-purple-600 mb-8">مرحبًا بك في لعبة المسابقات التقنية</h1>
      <button
        onClick={startQuiz}
        class="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105"
      >
        ابدأ المسابقة
      </button>
      <button
        onClick={props.onSignOut}
        class="cursor-pointer mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}

export default Home;
import { createSignal, onMount, For, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function Quiz() {
  const [questions, setQuestions] = createSignal([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [userAnswer, setUserAnswer] = createSignal('');
  const [score, setScore] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const [quizFinished, setQuizFinished] = createSignal(false);
  const [feedback, setFeedback] = createSignal('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'أنشئ لي 5 أسئلة في مجال التقنية باللغة العربية مع خيارات متعددة وعدد صحيح 1 للإجابة الصحيحة. أعد النتيجة في صيغة JSON بالهيكل التالي: {"questions": [{"question": "نص السؤال", "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"], "answer": "رقم الإجابة الصحيحة (0-based index)"}]}',
        response_type: 'json'
      });
      setQuestions(result.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchQuestions);

  const submitAnswer = () => {
    const currentQuestion = questions()[currentQuestionIndex()];
    if (userAnswer() === currentQuestion.answer) {
      setScore(score() + 1);
      setFeedback('إجابة صحيحة!');
    } else {
      setFeedback('إجابة خاطئة.');
    }

    setUserAnswer('');

    if (currentQuestionIndex() < questions().length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
      setFeedback('');
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div class="h-full flex flex-col justify-center items-center text-center">
      <Show when={!loading()} fallback={<div class="text-2xl text-purple-600">جاري تحميل الأسئلة...</div>}>
        <Show when={!quizFinished()} fallback={
          <div>
            <h2 class="text-3xl font-bold text-purple-600 mb-4">انتهت المسابقة!</h2>
            <p class="text-xl">درجتك: {score()} من {questions().length}</p>
          </div>
        }>
          <div>
            <h2 class="text-2xl font-bold text-purple-600 mb-4">السؤال {currentQuestionIndex() + 1} من {questions().length}</h2>
            <p class="text-xl mb-6">{questions()[currentQuestionIndex()].question}</p>
            <div class="space-y-4 mb-6">
              <For each={questions()[currentQuestionIndex()].options}>
                {(option, index) => (
                  <div>
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        name="option"
                        value={index()}
                        checked={userAnswer() === index().toString()}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        class="form-radio h-5 w-5 text-purple-600 cursor-pointer"
                      />
                      <span class="ml-2 text-lg">{option}</span>
                    </label>
                  </div>
                )}
              </For>
            </div>
            <button
              onClick={submitAnswer}
              disabled={userAnswer() === ''}
              class="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إرسال الإجابة
            </button>
            <Show when={feedback()}>
              <p class="mt-4 text-xl">{feedback()}</p>
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default Quiz;
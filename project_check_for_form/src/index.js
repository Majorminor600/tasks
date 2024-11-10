import readlineSync from 'readline-sync';
import { Task } from './models/Task.js';
import { TaskList } from './models/TaskList.js';

const taskList = new TaskList();

async function main() {
  await taskList.loadFromFile();

  while (true) {
    console.clear();
    console.log('\n=== Менеджер Задач ===');
    console.log('1. Добавить новую задачу');
    console.log('2. Показать все задачи');
    console.log('3. Показать выполненные задачи');
    console.log('4. Показать невыполненные задачи');
    console.log('5. Изменить статус задачи');
    console.log('6. Удалить задачу');
    console.log('7. Выход');

    const choice = readlineSync.question('\nВыберите действие (1-7): ');

    switch (choice) {
      case '1':
        const title = readlineSync.question('Введите название задачи: ');
        const description = readlineSync.question('Введите описание задачи (необязательно): ');
        await taskList.addTask(title, description);
        console.log('Задача успешно добавлена!');
        break;

      case '2':
        displayTasks(taskList.getAllTasks(), 'Все Задачи');
        break;

      case '3':
        displayTasks(taskList.getCompletedTasks(), 'Выполненные Задачи');
        break;

      case '4':
        displayTasks(taskList.getPendingTasks(), 'Невыполненные Задачи');
        break;

      case '5':
        const taskId = parseInt(readlineSync.question('Введите ID задачи для изменения статуса: '));
        if (await taskList.toggleTaskComplete(taskId)) {
          console.log('Статус задачи обновлен!');
        } else {
          console.log('Задача не найдена!');
        }
        break;

      case '6':
        const removeId = parseInt(readlineSync.question('Введите ID задачи для удаления: '));
        if (await taskList.removeTask(removeId)) {
          console.log('Задача успешно удалена!');
        } else {
          console.log('Задача не найдена!');
        }
        break;

      case '7':
        console.log('До свидания!');
        process.exit(0);

      default:
        console.log('Неверный выбор. Попробуйте снова.');
    }

    readlineSync.question('\nНажмите Enter для продолжения...');
  }
}

function displayTasks(tasks, title) {
  console.log(`\n=== ${title} ===`);
  if (tasks.length === 0) {
    console.log('Задачи не найдены.');
    return;
  }

  tasks.forEach(task => {
    console.log(`\nID: ${task.id}`);
    console.log(`Название: ${task.title}`);
    console.log(`Описание: ${task.description || 'Нет описания'}`);
    console.log(`Статус: ${task.completed ? 'Выполнено' : 'Не выполнено'}`);
    console.log(`Создано: ${task.createdAt.toLocaleString('ru-RU')}`);
    console.log('-'.repeat(30));
  });
}

main().catch(console.error);
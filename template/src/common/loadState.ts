export enum LoadState {
  // статусы ожидания
  needLoad = "needLoad", // в стейете еще не никакой иформации
  idle = "idle", // инфа обновилась или подгрузилась, после  этого возможен load more
  error = "error", // ошибка загрузки
  allIsLoaded = "allIsLoaded", // все загружено, load more ничего не вернет

  // статусы загрузки
  firstLoad = "firstLoad", // осуществляется первая загрузка информации, стейт был пуст
  hasMore = "hasMore",
  pullToRefresh = "pullToRefresh", // некоторая информация уже была в стейте, выполняется жестом
  refreshing = "refreshing", // обновление информации
  loadingMore = "loadingMore", // загрузка новой(следующей) страницы
}

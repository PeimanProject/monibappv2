import Dexie from 'dexie';

export const db = new Dexie('MonibAppDB');
db.version(2).stores({
  downloads: 'id, lectureId, fileName, title , size ,type, localPath, categoryId, status, createdAt', // id will be "123-audio"
  lectures: 'id ,row_number ,series_row ,duration ,verse  ,course ,series_type ,series_title ,main_id ,series_id ,metadata',
  series: " id ,rowId ,title ,displayRow ,lectureId ,lectureCount ,description ,mainId , type ,[mainId+rowId]",
  inbox: '++id, title, body, date, isRead, data'
});
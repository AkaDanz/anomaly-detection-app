from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Anomaly(Base):
    __tablename__ = 'anomalies'

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    is_anomaly = Column(Integer, nullable=False)  # 1 for anomaly, 0 for normal

    def __repr__(self):
        return f"<Anomaly(id={self.id}, timestamp={self.timestamp}, value={self.value}, is_anomaly={self.is_anomaly})>"
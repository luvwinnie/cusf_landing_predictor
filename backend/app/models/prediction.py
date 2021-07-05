# from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String,ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base

# if TYPE_CHECKING:
#     from .user import User  # noqa: F401
class prediction(Base):
    id = Column(Integer, primary_key=True, index=True)
    polylines = Column(ARRAY(float))
    # description = Column(String, index=True)
    # owner_id = Column(Integer, ForeignKey("user.id"))
    # owner = relationship("User", back_populates="items")

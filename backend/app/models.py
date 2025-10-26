from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Integer, String, Text, ForeignKey,  select, Boolean
import sqlalchemy.orm as so

from app import db


class Category(db.Model):
    __tablename__ = 'category'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[Optional[str]] = so.mapped_column(
        String(100), index=True, unique=True, default='')

    # Вернет ошибку удаления 
    # recipes: so.WriteOnlyMapped['Recipe'] = so.relationship(back_populates='recipe_name')

    # Удаляет только категорию. Поэтому перед удалением категории необходимо явно удалить все связанные рецепты 
    # recipes: so.WriteOnlyMapped['Recipe'] = so.relationship(back_populates='recipe_name', passive_deletes=True)

    # Удаляет все рецепты категории и саму категорию
    recipes: so.Mapped['Recipe'] = so.relationship(back_populates='recipe_name', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.name}>'


class Recipe(db.Model):
    __tablename__ = 'recipe'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(
        String(100), index=True, unique=True)
    ingredients: so.Mapped[str] = so.mapped_column(Text, index=True)
    instructions: so.Mapped[str] = so.mapped_column(Text)
    links: so.Mapped[Optional[str]] = so.mapped_column(Text)
    comment: so.Mapped[Optional[str]] = so.mapped_column(Text)
    timestamp: so.Mapped[datetime] = so.mapped_column(
        index=True, default=lambda: datetime.now())
    version: so.Mapped[int] = so.mapped_column(Integer, default=0)
    category_id: so.Mapped[int] = so.mapped_column(
        ForeignKey(Category.id), index=True, default=1)
    file: so.Mapped[Optional[str]] = so.mapped_column(String(255))
    favorite: so.Mapped[Optional[bool]] = so.mapped_column(Boolean, nullable=True)

    recipe_name: so.Mapped[Category] = so.relationship(back_populates='recipes')

    def __repr__(self):
        return f'<Recipe {self.title}>'

    def add_to_favorites(self):
        self.favorite = True
        db.session.commit()

    def remove_from_favorites(self):
        self.favorite = False
        db.session.commit()

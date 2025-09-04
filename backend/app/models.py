from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Integer, String, Text, ForeignKey,  select
import sqlalchemy.orm as so

from app import db


class Category(db.Model):
    __tablename__ = 'category'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[Optional[str]] = so.mapped_column(
        String(100), index=True, unique=True)

    recipes: so.WriteOnlyMapped['Recipe'] = so.relationship(back_populates='recipe_name')

    def __repr__(self):
        return f'<Category {self.name}>'


class Recipe(db.Model):
    __tablename__ = 'recipe'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(
        String(100), index=True, unique=True)
    ingredients: so.Mapped[str] = so.mapped_column(Text, index=True)
    instructions: so.Mapped[str] = so.mapped_column(Text)
    image: so.Mapped[Optional[str]] = so.mapped_column(String(100))
    links: so.Mapped[Optional[str]] = so.mapped_column(Text)
    comment: so.Mapped[Optional[str]] = so.mapped_column(Text)
    timestamp: so.Mapped[datetime] = so.mapped_column(
        index=True, default=lambda: datetime.now())
    version: so.Mapped[int] = so.mapped_column(Integer, default=0)
    category_id: so.Mapped[int] = so.mapped_column(
        ForeignKey(Category.id), index=True)

    recipe_name: so.Mapped[Category] = so.relationship(back_populates='recipes')

    def __repr__(self):
        return f'<Recipe {self.title}>'

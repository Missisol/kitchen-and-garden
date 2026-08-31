from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Integer, String, Text, ForeignKey, select, Boolean, Table, MetaData, Column
import sqlalchemy.orm as so

from app import db


class Category(db.Model):
    __tablename__ = 'category'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[Optional[str]] = so.mapped_column(
        String(100), index=True, unique=True, default='')

    recipes: so.Mapped['Recipe'] = so.relationship(back_populates='recipe_name', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.name}>'


class Recipe(db.Model):
    __tablename__ = 'recipe'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(String(100), index=True, unique=True)
    title_search: so.Mapped[Optional[str]] = so.mapped_column(String(100), index=True, default='')
    ingredients: so.Mapped[str] = so.mapped_column(Text, index=True)
    instructions: so.Mapped[str] = so.mapped_column(Text)
    links: so.Mapped[Optional[str]] = so.mapped_column(Text)
    comment: so.Mapped[Optional[str]] = so.mapped_column(Text)
    timestamp: so.Mapped[datetime] = so.mapped_column(
        index=True, default=lambda: datetime.now(timezone.utc))
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


# Промежуточная таблица для many-to-many связи Diary и Tag
diary_tags = Table(
    'diary_tags',
    db.Model.metadata,
    Column('diary_id', Integer, ForeignKey('diary.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True),
)


class Tag(db.Model):
    __tablename__ = 'tag'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[Optional[str]] = so.mapped_column(
        String(50), index=True, unique=True, default='')

    diary_entries: so.Mapped[list['Diary']] = so.relationship(
        back_populates='tags', secondary=diary_tags)

    def __repr__(self):
        return f'<Tag {self.name}>'


class Diary(db.Model):
    __tablename__ = 'diary'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(String(100), index=True, unique=True)
    description: so.Mapped[Optional[str]] = so.mapped_column(Text)
    links: so.Mapped[Optional[str]] = so.mapped_column(Text)
    timestamp: so.Mapped[datetime] = so.mapped_column(
        index=True, default=lambda: datetime.now(timezone.utc))
    file: so.Mapped[Optional[str]] = so.mapped_column(String(255))
    
    tags: so.Mapped[list['Tag']] = so.relationship(
        back_populates='diary_entries', secondary=diary_tags)

    def __repr__(self):
        return f'<Diary {self.title}>'